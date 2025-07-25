'use client'

import SlideIn from "@styles/components/slidein"
import MetricCard from "./components/card"
import { useAlertsContext } from "../../context/alert-context"
import MetricCardSkeleton from "./components/metrics-skeleton"
import { IMetricCard } from "../../utils/types"

const Metrics = () => {
    const {pageId, setPageId, pageSize, setPageSize, reportsData, reportsLoading, reportsError, refetchAlerts, reportsIsFetching, metricsData} = useAlertsContext()

    if(reportsLoading) {
        return <MetricCardSkeleton />
    }
    
    return (
        <div className="w-full justify-center flex">
            <div className="flex items-center gap-4 w-[1024px]">
                {
                    metricsData?.map((metric : IMetricCard, index : number) => (
                        <SlideIn
                            direction="left"
                            duration={0.5}
                            delay={index * 0.1}
                            key={index}
                            className="flex-1 flex"
                        >
                            <MetricCard
                                metric={metric}
                            />
                        </SlideIn>
                    ))
                }
            </div>
        </div>
    )
}
export default Metrics