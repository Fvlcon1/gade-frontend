'use client'

import { protectedApi } from "@/utils/apis/api"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { FilterStatus, FilterSeverity, IMetricCard } from "../utils/types"
import { GoAlertFill } from "react-icons/go"
import { transformKeysToCamelCase } from "@/utils/utils"
import { toast } from "react-hot-toast"

const statusMapping: Record<FilterStatus, string> = {
    "open": "OPEN",
    "under review": "IN_REVIEW",
    "closed": "CLOSED"
}

const severityMapping: Record<FilterSeverity, string> = {
    "high": "HIGH",
    "medium": "MEDIUM",
    "low": "LOW"
}

const useReports = () => {
    const [pageId, setPageId] = useState(1)
    const [pageSize, setPageSize] = useState(20)
    const [metricsData, setMetricsData] = useState<IMetricCard[]>([])
    const [reportsData, setReportsData] = useState<any[]>([])
    const [selectedStatus, setSelectedStatus] = useState<FilterStatus | null>(null)
    const [selectedSeverity, setSelectedSeverity] = useState<FilterSeverity | null>(null)

    const getReports = async () => {
        const filter  : any= {
            page: pageId,
            page_size: pageSize,
        }
        if(selectedStatus){
            console.log("I have a status")
            filter.status = statusMapping[selectedStatus.toLowerCase()]
        }
        if(selectedSeverity){
            filter.severity = severityMapping[selectedSeverity.toLowerCase()]
        }
        console.log({filter})
        const response = await protectedApi.GET("admin/report", filter)
        setMetricsData(transformMetricsData(response))
        setReportsData(transformKeysToCamelCase(response))
        return response
    }

    useEffect(()=>{
        console.log({selectedStatus, selectedSeverity})
    }, [selectedStatus, selectedSeverity])

    const updateReport = async ({id, status}: {id: string, status: string}) => {
        const response = await protectedApi.PATCH(`admin/report/${id}/status`, { status : statusMapping[status] })
        return response
    }

    const {mutate: updateReportMutation, isPending: updateReportLoading, isSuccess: updateReportSuccess} = useMutation({
        mutationFn: updateReport,
        onSuccess: () => {
            toast.success("Report updated successfully")
            refetchReports()
        },
        onError: () => {
            toast.error("Failed to update report")
        }
    })

    const {data, isLoading: reportsLoading, error: reportsError, refetch: refetchReports, isFetching: reportsIsFetching } = useQuery({
        queryKey: ["reports", pageId, pageSize, selectedStatus, selectedSeverity],
        queryFn: getReports,
        staleTime: 0
    })

    const transformMetricsData = (data: any) => {
        const metrics: IMetricCard[] = [
            {
                title: "Total Reports",
                value: data?.length,
                color: "6060D0",
                icon: GoAlertFill
            },
            {
                title: "High Severity",
                value: data?.filter(report => report.severity === 'HIGH').length,
                color: "299B46",
                icon: GoAlertFill
            },
            {
                title: "Medium Severity",
                value: data?.filter(report => report.severity === 'MEDIUM').length,
                color: "FF0000",
                icon: GoAlertFill
            },
            {
                title: "Low Severity",
                value: data?.filter(report => report.severity === 'LOW').length,
                color: "FF9500",
                icon: GoAlertFill
            },
        ]
        console.log({metrics})
        return metrics
    }

    useEffect(()=>{
        if(data){
            setMetricsData(transformMetricsData(data))
            setReportsData(transformKeysToCamelCase(data))
        }
    }, [])

    return {
        pageId,
        setPageId,
        pageSize,
        setPageSize,
        reportsData,
        reportsLoading,
        reportsError,
        refetchReports,
        reportsIsFetching,
        metricsData,
        selectedStatus,
        selectedSeverity,
        setSelectedStatus,
        setSelectedSeverity,
        updateReportMutation,
        updateReportLoading,
        updateReportSuccess
    }
}
export default useReports