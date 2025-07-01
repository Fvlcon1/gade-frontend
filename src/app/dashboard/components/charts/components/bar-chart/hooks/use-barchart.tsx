'use client'

import { useDashboardContext } from "@/app/dashboard/context/dashboard-context"
import { useEffect, useState } from "react"
import { formatWithPrefix } from "@/utils/unit-utils"

const useBarChart = () => {
    const { districtsByArea} = useDashboardContext()
    const [barChartData, setBarChartData] = useState<any>([])
    const [categories, setCategories] = useState<any>([])

    // Sort districtsByArea in ascending order by totalArea before processing
    function sortDistrictsByAreaAsc(districts: typeof districtsByArea) {
        return [...districts].sort((a, b) => a.totalArea - b.totalArea);
    }

    useEffect(() => {
        if (districtsByArea) {
            const sortedDistricts = sortDistrictsByAreaAsc(districtsByArea);
            setCategories(sortedDistricts.map((item) => item.district));
            setBarChartData([
                {
                    name: 'districts',
                    data: sortedDistricts.map((item) => item.totalArea)
                },
            ]);
        }
    }, [districtsByArea]);

    return {
        barChartSeries: barChartData,
        categories
    }
}
export default useBarChart