import { useState } from "react"
import { FaBell, FaCheckCircle, FaChromecast } from "react-icons/fa"
import { FaClock } from "react-icons/fa6"
import { RiRadarFill } from "react-icons/ri"

const useMetrics = () => {
    const [metrics, setMetrics] = useState([
        {
            title : "Illegal sites detected",
            value : "24",
            footer : "+4 Reports today",
            icon : RiRadarFill
        },
        {
            title : "Reported cases",
            value : "09",
            footer : "+105 Improvement",
            icon : FaClock
        },
        {
            title : "Total area detected (Ha)",
            value : "06",
            footer : "+1 Today",
            icon : FaChromecast
        },
        {
            title : "Active alerts",
            value : "18",
            footer : "+1 Today",
            icon : FaBell
        },
    ])

    return {
        metrics,
    }
}
export default useMetrics