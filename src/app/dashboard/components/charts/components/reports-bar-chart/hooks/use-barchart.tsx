'use client'

import { useDashboardContext } from "@/app/dashboard/context/dashboard-context"
import { useEffect, useState } from "react"
import { formatWithPrefix } from "@/utils/unit-utils"
import { shortMonthNames } from "@/utils/constants"

const useBarChart = () => {
    const { reportsOverTime } = useDashboardContext()
    const [barChartData, setBarChartData] = useState<any>([])
    const [categories, setCategories] = useState<any>([])

    useEffect(() => {
        if (reportsOverTime) {
            setCategories(reportsOverTime.map((item) => shortMonthNames[new Date(item.period).getMonth()]));
            setBarChartData([
                {
                    name: 'reports',
                    data: reportsOverTime.map((item) => item.value)
                },
            ]);
        }
    }, [reportsOverTime]);

    return {
        barChartSeries: barChartData,
        categories
    }
}
export default useBarChart