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
    selectedPriority: string,
    setSelectedStatus: Dispatch<SetStateAction<string>>,
    setSelectedPriority: Dispatch<SetStateAction<string>>
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
    selectedPriority: '',
    setSelectedStatus: () => {},
    setSelectedPriority: () => {}
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
