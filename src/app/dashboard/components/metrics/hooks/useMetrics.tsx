import { useEffect, useState } from "react"
import { FaBell, FaChromecast } from "react-icons/fa"
import { FaClock } from "react-icons/fa6"
import { RiRadarFill } from "react-icons/ri"
import { useDashboardContext } from "@/app/dashboard/context/dashboard-context"
import { Metric } from "@/app/dashboard/utils/types"
import { formatWithPrefix, formatWithUnit } from "@/utils/unit-utils"
import { formatNumber } from "@/utils/number-utils"

const useMetrics = () => {
    const { metrics : dashboardMetrics } = useDashboardContext()
    const { totalAreaDetected, totalIllegalSites, totalReportedCases } = dashboardMetrics || {}
    const [metrics, setMetrics] = useState<Metric[]>([])

    useEffect(()=>{
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
                title: "Total area detected",
                value: formatWithUnit({value : totalAreaDetected, type : "area"}),
                footer: "+1 Today",
                icon: FaChromecast
            },
            // {
            //     title: "Active alerts",
            //     value: formatNumber(18),
            //     footer: "+1 Today",
            //     icon: FaBell
            // },
        ])
    }, [dashboardMetrics])

    return {
        metrics,
    }
}
export default useMetrics