'use client'

import { protectedApi } from "@/utils/apis/api"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { IMetricCard } from "../utils/types"
import { GoAlertFill } from "react-icons/go"
import { transformKeysToCamelCase } from "@/utils/utils"

const useReports = () => {
    const [pageId, setPageId] = useState(1)
    const [pageSize, setPageSize] = useState(20)
    const [metricsData, setMetricsData] = useState<IMetricCard[]>([])
    const [reportsData, setReportsData] = useState<any[]>([])
    const [selectedStatus, setSelectedStatus] = useState('')
    const [selectedPriority, setSelectedPriority] = useState('')

    const getReports = async () => {
        const response = await protectedApi.GET("admin/report", {
            page: pageId,
            page_size: pageSize
        })
        setMetricsData(transformMetricsData(response))
        setReportsData(transformKeysToCamelCase(response))
        return response
    }

    const {data, isLoading: reportsLoading, error: reportsError, refetch: refetchReports, isFetching: reportsIsFetching } = useQuery({
        queryKey: ["reports", pageId, pageSize],
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
                title: "High Priority",
                value: data?.filter(report => report.severity === 'HIGH').length,
                color: "299B46",
                icon: GoAlertFill
            },
            {
                title: "Medium Priority",
                value: data?.filter(report => report.severity === 'MEDIUM').length,
                color: "FF0000",
                icon: GoAlertFill
            },
            {
                title: "Low Priority",
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
        selectedPriority,
        setSelectedStatus,
        setSelectedPriority
    }
}
export default useReports