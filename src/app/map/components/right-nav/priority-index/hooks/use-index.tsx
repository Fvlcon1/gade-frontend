import { useSpatialStore } from "@/lib/store/spatial-store";
import { useState } from "react";
import dayjs from "dayjs";
import { getMonthsBetweenDates } from "@/utils/date-utils";
import { protectedApi } from "@/utils/apis/api";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

const usePriorityIndex = () => {
    const { months, setMonths, setHeatmapData } = useSpatialStore();
    const [startDate, setStartDate] = useState(new Date(months[0].year, months[0].monthIndex));
    const [endDate, setEndDate] = useState(new Date(months[months.length - 1].year, months[months.length - 1].monthIndex));
    
    const handleDateChange = (dates: [dayjs.Dayjs, dayjs.Dayjs]) => {
        if (dates) {
            setStartDate(dates[0].toDate());
            setEndDate(dates[1].toDate());
            setMonths(getMonthsBetweenDates(dates[0].toDate(), dates[1].toDate()));
        }
    }

    const getHeatmapData = async () => {
        const response = await protectedApi.GET("/data/heatmap-data", {
            start_date: startDate.toISOString().split("T")[0],
            end_date: endDate.toISOString().split("T")[0]
        })
        return response
    }

    const {mutateAsync : getHeatmapDataMutation, isPending : getHeatmapDataPending, isSuccess : getHeatmapDataSuccess, isError : getHeatmapDataError} = useMutation({
        mutationFn: getHeatmapData,
        onSuccess : async (data : any) => {
            setHeatmapData(data)
            toast.success("Heatmap data fetched successfully")
        },
        onError : (error : any) => {
            toast.error(error?.response?.data?.message || "Failed to fetch heatmap data")
        }
    })

    return {
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        handleDateChange,
        getHeatmapDataMutation,
        getHeatmapDataPending,
        getHeatmapDataSuccess,
        getHeatmapDataError
    }
}
export default usePriorityIndex