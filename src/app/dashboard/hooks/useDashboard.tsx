import { protectedApi } from "@/utils/apis/api";
import { useQuery } from "@tanstack/react-query";
import { Ranking } from "../utils/types";
import { useState, Dispatch, SetStateAction } from "react";
import { formatWithPrefix } from "@/utils/unit-utils";

// Utility to convert snake_case to camelCase
const toCamelCase = (str: string) =>
    str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

// Recursively convert all object keys to camelCase
const transformKeysToCamelCase = (obj: any): any => {
    if (Array.isArray(obj)) {
        return obj.map(transformKeysToCamelCase);
    } else if (obj !== null && typeof obj === "object") {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [
                toCamelCase(key),
                transformKeysToCamelCase(value),
            ])
        );
    }
    return obj;
};

const getRankings = (metrics: any, setRankings: Dispatch<SetStateAction<Ranking[]>>) => {
    if (metrics?.districtsByArea) {
        const transformed: Ranking[] = metrics.districtsByArea.map((item: any) => ({
            district: item.district,
            area: `${formatWithPrefix(item.totalArea, "Km2")}`,
        }));
        transformed.length = 5
        setRankings(transformed);
    }
}

const useDashboard = () => {
    const [rankings, setRankings] = useState<Ranking[]>([]);

    const getMetrics = async () => {
        const response = await protectedApi.GET("/data/metrics");
        const transformedData = transformKeysToCamelCase(response)
        getRankings(transformedData, setRankings)
        return transformedData
    };

    const getReports = async () => {
        const response = await protectedApi.GET("/admin/report", {page_id: 1, page_size: 5});
        const transformeReports = transformKeysToCamelCase(response)
        return transformeReports
    }

    const { data: metrics, isPending: isMetricsPending } = useQuery({
        queryFn: getMetrics,
        queryKey: ["metrics"],
        refetchOnMount: true,
    });

    const { data: reports, isPending: isReportsPending } = useQuery({
        queryFn: getReports,
        queryKey: ["reports"],
        refetchOnMount: true,
    });

    return {
        ...metrics,
        isMetricsPending,
        rankings,
        setRankings,
        reports,
        isReportsPending
    };
};

export default useDashboard;