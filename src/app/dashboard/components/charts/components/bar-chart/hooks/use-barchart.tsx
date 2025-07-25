'use client'

import { useDashboardContext } from "@/app/dashboard/context/dashboard-context"
import { useEffect, useState } from "react"
import { formatWithUnit } from "@/utils/unit-utils"

const useBarChart = () => {
    const { districtsByArea} = useDashboardContext()
    const [barChartSeries, setBarChartSeries] = useState<any>([])
    const [categories, setCategories] = useState<any>([])

    // Sort districtsByArea in ascending order by totalArea before processing
    function sortDistrictsByAreaAsc(districts: typeof districtsByArea) {
        return [...districts].sort((a, b) => a.totalArea - b.totalArea);
    }

    useEffect(() => {
        if (districtsByArea) {
            const sortedDistricts = sortDistrictsByAreaAsc(districtsByArea);
            setCategories(sortedDistricts.map((item) => item.district));
            const unit = "ha"
            setBarChartSeries([
                {
                    name: `Area (${unit})`,
                    data: sortedDistricts.map((item) => formatWithUnit({value: item.totalArea, type: "area", unit}))
                },
            ]);
        }
    }, [districtsByArea]);

    return {
        barChartSeries,
        categories
    }
}
export default useBarChart