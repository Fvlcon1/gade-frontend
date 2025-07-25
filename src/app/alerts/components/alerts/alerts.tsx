'use client'

import NoData from "@components/ui/NoData/noData"
import { useAlertsContext } from "../../context/alert-context"
import AlertCard from "./components/alert-card/alert-card"
import AlertsSkeleton from "./components/alert-skeleton"

const Alerts = () => {
    const {alertsData, alertsLoading, alertsIsFetching} = useAlertsContext()

    if(alertsLoading) {
        return (
            <div className="flex flex-col gap-3">
                {
                    Array.from({ length: 8 }).map((_, index) => (
                        <AlertsSkeleton key={index} />
                    ))
                }
            </div>
        )
    }

    // if(!alertsData || alertsData.length === 0) {
    //     return (
    //         <NoData />
    //     )
    // }

    return (
        <div className={`flex ${alertsIsFetching ? "cursor-wait opacity-50" : ""} pt-5 justify-center w-full`}>
            <div className="flex flex-col gap-3">
                {
                    Array.from({ length: 8 }).map((_, index) => (
                        <AlertCard
                            key={index}
                            alert={null}
                            alertIsFetching={alertsIsFetching}
                        />
                    ))
                }
            </div>
        </div>
    )
}
export default Alerts