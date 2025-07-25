'use client'

import { useDashboardContext } from "@/app/dashboard/context/dashboard-context"
import { useEffect, useState } from "react"
import { formatWithUnit } from "@/utils/unit-utils"
import { shortMonthNames } from "@/utils/constants"

const useLineChart = () => {
    const { forestReserveAffectedOverTime} = useDashboardContext()
    const [lineChartData, setLineChartData] = useState<any>([])
    const [categories, setCategories] = useState<any>([])

    useEffect(()=>{
        if(forestReserveAffectedOverTime){
            setCategories(forestReserveAffectedOverTime.map((item)=>{
                return shortMonthNames[new Date(item.period).getMonth()]
            }))
            const unit = "ha"
            setLineChartData([
                {
                    name: `Area (${unit})`,
                    data: forestReserveAffectedOverTime.map((item)=> formatWithUnit({value: item.value, type: "area", unit}))
                },
            ])
        }
    },[forestReserveAffectedOverTime])

    return {
        lineChartSeries: lineChartData,
        categories
    }
}
export default useLineChart