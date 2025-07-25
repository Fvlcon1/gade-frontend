'use client'

import { useDashboardContext } from "@/app/dashboard/context/dashboard-context"
import { useEffect, useState } from "react"
import { shortMonthNames } from "@/utils/constants"

const useLineChart = () => {
    const { reportsOverTime} = useDashboardContext()
    const [lineChartData, setLineChartData] = useState<any>([])
    const [categories, setCategories] = useState<any>([])

    useEffect(()=>{
        if(reportsOverTime){
            setCategories(reportsOverTime.map((item)=>{
                return shortMonthNames[new Date(item.period).getMonth()]
            }))
            setLineChartData([
                {
                    name: `Reports`,
                    data: reportsOverTime.map((item)=> item.value)
                },
            ])
        }
    },[reportsOverTime])

    return {
        lineChartSeries: lineChartData,
        categories
    }
}
export default useLineChart