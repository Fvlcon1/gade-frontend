'use client'

import { useDashboardContext } from "@/app/dashboard/context/dashboard-context"
import { useEffect, useState } from "react"
import { formatWithPrefix } from "@/utils/unit-utils"
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
            setLineChartData([
                {
                    name: 'area',
                    data: areaOverTime.map((item)=> formatWithPrefix(item.value, "km2", 1))
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