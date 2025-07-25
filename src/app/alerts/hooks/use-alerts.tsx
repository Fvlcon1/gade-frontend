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

const useAlerts = () => {
    const [pageId, setPageId] = useState(1)
    const [pageSize, setPageSize] = useState(20)
    const [metricsData, setMetricsData] = useState<IMetricCard[]>([])
    const [alertsData, setAlertsData] = useState<any[]>([])
    const [selectedStatus, setSelectedStatus] = useState<FilterStatus | null>(null)
    const [selectedSeverity, setSelectedSeverity] = useState<FilterSeverity | null>(null)

    const getAlerts = async () => {
        const filter  : any= {
            page_id: pageId,
            page_size: pageSize,
        }
        if(selectedStatus){
            filter.status = statusMapping[selectedStatus.toLowerCase()]
        }
        if(selectedSeverity){
            filter.severity = severityMapping[selectedSeverity.toLowerCase()]
        }
        const response = await protectedApi.GET("alerts", filter)
        setAlertsData(transformKeysToCamelCase(response))
        return response
    }

    const updateAlert = async ({id, status}: {id: string, status: string}) => {
        const response = await protectedApi.PATCH(`admin/alert/${id}/status`, { status : statusMapping[status] })
        return response
    }

    const {mutate: updateAlertMutation, isPending: updateAlertLoading, isSuccess: updateAlertSuccess} = useMutation({
        mutationFn: updateAlert,
        onSuccess: () => {
            toast.success("Alert updated successfully")
            refetchAlerts()
        },
        onError: () => {
            toast.error("Failed to update alert")
        }
    })

    const {data, isLoading: alertsLoading, error: alertsError, refetch: refetchAlerts, isFetching: alertsIsFetching } = useQuery({
        queryKey: ["alerts", pageId, pageSize, selectedStatus, selectedSeverity],
        queryFn: getAlerts,
        staleTime: 0
    })

    const getAlertMetrics = async () => {
        const response = await protectedApi.GET("admin/alert/metrics")
        setMetricsData(transformMetricsData(response))
        return response
    }

    const {data: fetchedMetricsData, isLoading: metricsLoading, error: metricsError, refetch: refetchMetrics, isFetching: metricsIsFetching } = useQuery({
        queryKey: ["metrics"],
        queryFn: getAlertMetrics,
        staleTime: 0
    })

    const transformMetricsData = (data: any) => {
        const metrics: IMetricCard[] = [
            {
                title: "Total Alerts",
                value: data?.total_alerts,
                color: "6060D0",
                icon: GoAlertFill
            },
            {
                title: "High Severity",
                value: data?.high_severity,
                color: "299B46",
                icon: GoAlertFill
            },
            {
                title: "Medium Severity",
                value: data?.medium_severity,
                color: "FF0000",
                icon: GoAlertFill
            },
            {
                title: "Low Severity",
                value: data?.low_severity,
                color: "FF9500",
                icon: GoAlertFill
            },
        ]
        return metrics
    }

    useEffect(()=>{
        if(data){
            setAlertsData(transformKeysToCamelCase(data))
        }
    }, [])

    return {
        pageId,
        setPageId,
        pageSize,
        setPageSize,
        alertsData,
        alertsLoading,
        alertsError,
        refetchAlerts,
        alertsIsFetching,
        metricsData,
        metricsLoading,
        metricsError,
        refetchMetrics,
        metricsIsFetching,
        selectedStatus,
        selectedSeverity,
        setSelectedStatus,
        setSelectedSeverity,
        updateAlertMutation,
        updateAlertLoading,
        updateAlertSuccess
    }
}
export default useAlerts