import { useEffect, useState } from "react"
import { FaBell, FaChromecast } from "react-icons/fa"
import { FaClock, FaTree } from "react-icons/fa6"
import { RiRadarFill } from "react-icons/ri"
import { useDashboardContext } from "@/app/dashboard/context/dashboard-context"
import { Metric } from "@/app/dashboard/utils/types"
import { formatWithPrefix, formatWithUnit } from "@/utils/unit-utils"
import { formatNumber } from "@/utils/number-utils"

const useMetrics = () => {
    const { metrics : dashboardMetrics } = useDashboardContext()
    const { totalAreaDetected, totalIllegalSites, totalReportedCases, totalForestAreaAffected } = dashboardMetrics || {}
    const [metrics, setMetrics] = useState<Metric[]>([])

    useEffect(()=>{
        const area = formatWithUnit({value : totalAreaDetected, type : "area"}).split(" ")
        const areaFigure = area[0]
        const areaUnit = area[1]

        const forestArea = formatWithUnit({value : totalForestAreaAffected, type : "area"}).split(" ")
        const forestAreaFigure = forestArea[0]
        const forestAreaUnit = forestArea[1]
        
        setMetrics([
            {
                title: "Illegal sites detected",
                value: formatNumber(totalIllegalSites, 0),
                footer: "+4 Reports today",
                icon: RiRadarFill,
                
            },
            {
                title: "Reported cases",
                value: formatNumber(totalReportedCases, 0),
                footer: "+105 Improvement",
                icon: FaClock
            },
            {
                title: `Total area detected (${areaUnit})`,
                value: areaFigure,
                footer: "+1 Today",
                icon: FaChromecast
            },
            {
                title: `Total forest area affected (${forestAreaUnit})`,
                value: forestAreaFigure,
                footer: "+1 Today",
                icon: FaTree
            },
        ])
    }, [dashboardMetrics])

    return {
        metrics,
    }
}
export default useMetrics