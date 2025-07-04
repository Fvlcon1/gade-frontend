'use client'

import { createContext, Dispatch, SetStateAction, ReactNode, useContext } from "react";
import useReports from "../hooks/useReports";
import { IMetricCard } from "../utils/types";

const ReportsContext = createContext<{
    pageId: number,
    setPageId: Dispatch<SetStateAction<number>>,
    pageSize: number,
    setPageSize: Dispatch<SetStateAction<number>>,
    reportsData: any,
    reportsLoading: boolean,
    reportsError: any,
    refetchReports: () => void,
    reportsIsFetching: boolean,
    metricsData: IMetricCard[],
    selectedStatus: string,
    selectedSeverity: string,
    setSelectedStatus: Dispatch<SetStateAction<string>>,
    setSelectedSeverity: Dispatch<SetStateAction<string>>,
    updateReportMutation: ({id, status}: {id: string, status: string}) => void,
    updateReportLoading: boolean,
    updateReportSuccess: boolean
}>({
    pageId: 1,
    setPageId: () => {},
    pageSize: 10,
    setPageSize: () => {},
    reportsData: null,
    reportsLoading: false,
    reportsError: null,
    refetchReports: () => {},
    reportsIsFetching: false,
    metricsData: [],
    selectedStatus: '',
    selectedSeverity: '',
    setSelectedStatus: () => {},
    setSelectedSeverity: () => {},
    updateReportMutation: ({id, status}: {id: string, status: string}) => {},
    updateReportLoading: false,
    updateReportSuccess: false
})

export const ReportsContextProvider = ({ children }: { children: ReactNode }) => {
    const reports = useReports()
    return (
        <ReportsContext.Provider
            value={{...reports}}
        >
            {children}
        </ReportsContext.Provider>
    )
}

export const useReportsContext = () => useContext(ReportsContext)
