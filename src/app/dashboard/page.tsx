'use client'

import Text from "@styles/components/text"
import { IoStatsChart } from "react-icons/io5"
import Metrics from "./components/metrics/metrics"
import Charts from "./components/charts/charts"
import Right from "./components/right/right"
import RecentReports from "./components/recent-reports/recent-reports"
import { useTheme } from "@/app/styles/theme-context"
import SatelliteSpinner from "@components/ui/loaders/satellite-spinner"

const Header = () => {
    const { theme } = useTheme()
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <div className="w-[28px] h-[28px] rounded-md bg-main-primary/15 flex items-center justify-center">
                    <IoStatsChart
                        color={theme.darkColor}
                        size={15}
                    />
                </div>
                <Text
                    size={"18px"}
                    bold={theme.text.bold.md2}
                    textColor={theme.darkColor}
                >
                    Dashboard
                </Text>
            </div>
        </div>
    )
}

const Dashboard = () => {
    return (
        <div className="w-full flex gap-6 pr-[400px]">
            <div className="w-full flex flex-col py-4 gap-6">
                <Header />
                <Metrics />
                <Charts />
                <RecentReports />
            </div>
            <Right />
        </div>
    )
}
export default Dashboard