'use client'

import { createContext, Dispatch, SetStateAction, ReactNode, useState, useContext } from "react"
import useAccounts from "../hooks/useAccounts"


const AccountsContext = createContext<{
    accountsData: any
    accountsLoading: boolean
    accountsError: any
    metricsData: any
    refetchAccounts: () => void
    accountsIsFetching: boolean
    pageId: number
    setPageId: Dispatch<SetStateAction<number>>
    pageSize: number
    setPageSize: Dispatch<SetStateAction<number>>
}>({
    accountsData: null,
    accountsLoading: false,
    accountsError: null,
    metricsData: null,
    refetchAccounts: () => {},
    accountsIsFetching: false,
    pageId: 1,
    setPageId: () => {},
    pageSize: 10,
    setPageSize: () => {}
})

export const AccountsContextProvider = ({ children }: { children: ReactNode }) => {
    const accounts = useAccounts()

    return (
        <AccountsContext.Provider
            value={{...accounts}}
        >
            {children}
        </AccountsContext.Provider>
    )
}

export const useAccountsContext = () => useContext(AccountsContext)

