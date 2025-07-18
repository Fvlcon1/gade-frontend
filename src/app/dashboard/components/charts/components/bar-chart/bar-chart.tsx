import SlideIn from "@styles/components/slidein"
import Text from "@styles/components/text"
import theme from "@styles/theme"
import BarChartComponent from "./components/bar-chart-component"
import { useDashboardContext } from "@/app/dashboard/context/dashboard-context"
import ChartSkeleton from "../chart-skeleton"

const BarChart = () => {
    const {isMetricsPending} = useDashboardContext()
    
    if(isMetricsPending) {
        return (
            <ChartSkeleton />
        )
    }
    
    return (
        <SlideIn direction="bottom" className="flex flex-1 w-full">
            <div className="w-full h-full flex flex-col gap-2 px-4 pr-0">
                <div className="flex flex-col gap-[2px] flex-1 items-center">
                    <Text
                        // textColor={theme.colors.main.primary}
                        bold={theme.text.bold.md}
                        size={theme.text.size.HM}
                    >
                        Districts by area
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
export default BarChart