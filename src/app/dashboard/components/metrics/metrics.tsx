'use client'

import { hexOpacity } from "@/utils/hexOpacity"
import Text from "@styles/components/text"
import theme from "@styles/theme"
import useMetrics from "./hooks/useMetrics"
import { useDashboardContext } from "../../context/dashboard-context"
import { useState } from "react"
import MetricSkeleton from "./metric-skeleton"

interface Metric {
    title: string;
    value: string;
    footer: string;
    icon: any;
}

const Metric = ({metric}: {metric: Metric}) => {
    return (
        <div className="relative flex flex-col gap-1 bg-bg-primary-lighter rounded-2xl border-[1px] border-border-primary p-2 w-[270px]">
            {/* header */}
            <div className="flex items-center gap-2">
                <div className="w-[20px] h-[20px] rounded-sm bg-main-primary/15 flex items-center justify-center">
                    <metric.icon
                        color={theme.colors.main.primary}
                        size={12}
                    />
                </div>
                <Text
                    bold={theme.text.bold.md}
                // textColor={theme.colors.main.primary}
                >
                    {metric.title}
                </Text>
            </div>

            {/* body */}
            <Text
                size={"40px"}
                bold={theme.text.bold.md2}
                textColor={theme.colors.main.primary}
                lineHeight={1}
            >
                {metric.value}
            </Text>

            {/* footer */}
            <div className="flex px-2 py-1 bg-bg-primary shadow-xl rounded-lg w-fit">
                <Text
                    textColor={theme.colors.main.primary}
                    size={theme.text.size.xs}
                >
                    {metric.footer}
                </Text>
            </div>

            {/* Icon */}
            <div className="absolute top-1/5 right-4">
                <metric.icon
                    color={theme.colors.main.primary  + hexOpacity(10)}
                    size={60}
                />
            </div>
        </div>
    )
}

const Metrics = () => {
    const {metrics} = useMetrics()
    const {isMetricsPending} = useDashboardContext()
    return (
        <div className="w-full gap-8 flex mt-[-12px]">
            {
                isMetricsPending ? (
                    Array.from({ length: 4 }).map((_, index) => (
                        <MetricSkeleton key={index} />
                    ))
                ) : metrics.map((metric, index) => (
                    <Metric key={index} metric={metric} />
                ))
            }
        </div>
    )
}
export default Metrics