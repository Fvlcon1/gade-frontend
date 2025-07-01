import SlideIn from "@styles/components/slidein"
import Text from "@styles/components/text"
import theme from "@styles/theme"
import BarChartComponent from "./components/bar-chart-component"
import { useDashboardContext } from "@/app/dashboard/context/dashboard-context"
import ChartSkeleton from "../chart-skeleton"

const ReportsBarChart = () => {
    const {isMetricsPending} = useDashboardContext()
    
    if(isMetricsPending) {
        return (
            <ChartSkeleton />
        )
    }
    
    return (
        <SlideIn direction="bottom" className="flex flex-1 w-full">
            <div className="w-full h-full flex flex-col gap-2 px-4 pr-0">
                <div className="flex flex-col gap-[2px]">
                    <Text
                        textColor={theme.colors.main.primary}
                        bold={theme.text.bold.md}
                        // size={theme.text.size.HM}
                        lineHeight={1}
                    >
                        Reports over time
                    </Text>
                    <Text textColor={theme.colors.text.tetiary}>
                        Reports over time in the past year
                    </Text>
                </div>

                {/** Chart */}
                <div className="ml-[-10px] mt-[-10px]">
                    <BarChartComponent />
                </div>
            </div>
        </SlideIn>
    )
}
export default ReportsBarChart