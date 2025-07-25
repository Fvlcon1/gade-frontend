'use client'

import { useDashboardContext } from "@/app/dashboard/context/dashboard-context"
import { useEffect, useState } from "react"
import { formatWithPrefix, formatWithUnit } from "@/utils/unit-utils"
import { shortMonthNames } from "@/utils/constants"

const useLineChart = () => {
    const { areaOverTime} = useDashboardContext()
    const [lineChartData, setLineChartData] = useState<any>([])
    const [categories, setCategories] = useState<any>([])

    useEffect(()=>{
        if(areaOverTime){
            setCategories(areaOverTime.map((item)=>{
                return shortMonthNames[new Date(item.period).getMonth()]
            }))
            const unit = "ha"
            setLineChartData([
                {
                    name: `Area (${unit})`,
                    data: areaOverTime.map((item)=> formatWithUnit({value: item.value, type: "area", unit}))
                },
            ])
        }
    },[areaOverTime])

    return {
        lineChartSeries: lineChartData,
        categories
    }
}
export default useLineChart