'use client'

import { createContext, Dispatch, SetStateAction, ReactNode, useContext } from "react";
import useAlerts from "../hooks/use-alerts";
import { IMetricCard } from "../utils/types";

const AlertsContext = createContext<{
    pageId: number,
    setPageId: Dispatch<SetStateAction<number>>,
    pageSize: number,
    setPageSize: Dispatch<SetStateAction<number>>,
    alertsData: any,
    alertsLoading: boolean,
    alertsError: any,
    refetchAlerts: () => void,
    alertsIsFetching: boolean,
    metricsData: IMetricCard[],
    selectedStatus: string,
    selectedSeverity: string,
    setSelectedStatus: Dispatch<SetStateAction<string>>,
    setSelectedSeverity: Dispatch<SetStateAction<string>>,
    updateAlertMutation: ({id, status}: {id: string, status: string}) => void,
    updateAlertLoading: boolean,
    updateAlertSuccess: boolean
}>({
    pageId: 1,
    setPageId: () => {},
    pageSize: 10,
    setPageSize: () => {},
    alertsData: null,
    alertsLoading: false,
    alertsError: null,
    refetchAlerts: () => {},
    alertsIsFetching: false,
    metricsData: [],
    selectedStatus: '',
    selectedSeverity: '',
    setSelectedStatus: () => {},
    setSelectedSeverity: () => {},
    updateAlertMutation: ({id, status}: {id: string, status: string}) => {},
    updateAlertLoading: false,
    updateAlertSuccess: false
})

export const AlertsContextProvider = ({ children }: { children: ReactNode }) => {
    const alerts = useAlerts()
    return (
        <AlertsContext.Provider
            value={{...alerts}}
        >
            {children}
        </AlertsContext.Provider>
    )
}

export const useAlertsContext = () => useContext(AlertsContext)
