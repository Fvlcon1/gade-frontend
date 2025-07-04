'use client'

import SlideIn from "@styles/components/slidein"
import MetricCard from "./components/card"
import { useAccountsContext } from "../../context/context"
import MetricCardSkeleton from "./components/metrics-skeleton"
import { IMetricCard } from "../../utils/types"

const Metrics = () => {
    const {metricsData, accountsLoading} = useAccountsContext()

    if(accountsLoading) {
        return <MetricCardSkeleton />
    }
    
    return (
        <div className="w-full flex items-center gap-4">
            {
                metricsData?.map((metric : IMetricCard, index : number) => (
                    <SlideIn
                        direction="left"
                        duration={0.5}
                        delay={index * 0.1}
                        key={index}
                    >
                        <MetricCard
                            metric={metric}
                        />
                    </SlideIn>
                ))
            }
        </div>
    )
}
export default Metrics