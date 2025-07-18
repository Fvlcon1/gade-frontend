import SlideIn from "@styles/components/slidein"
import Text from "@styles/components/text"
import ChartComponent from "./chart-component"
import { DatePicker } from "antd"
import { useState } from "react"
import dayjs from "dayjs"
import useLineChart from "./hooks/useLineChart"
import { useDashboardContext } from "@/app/dashboard/context/dashboard-context"
import { useTheme } from "@styles/theme-context"

const LineChart = () => {
    const [selectedDate, setSelectedDate] = useState<string>("")
    const { lineChartSeries, categories } = useLineChart()
    const {isMetricsPending} = useDashboardContext()
    const {themeColor, theme} = useTheme()

    const handleMonthChange = (value: string) => {
        setSelectedDate(value)
    }

    return (
        <SlideIn direction="bottom" className="flex flex-1 w-full">
            <div className="w-full h-full flex flex-col gap-2 pl-4">
                <div className="w-full flex justify-between pr-4">
                    <div className="flex flex-col gap-[2px] flex-1 items-center">
                        <Text
                            textColor={theme.darkColor}
                            bold={theme.text.bold.md}
                            size={theme.text.size.HM}
                            className="!pl-[200px]"
                        >
                            Area Over Time
                        </Text>
                    </div>

                    <DatePicker
                        placeholder="Select Year"
                        className="custom-datepicker z-10 h-[30px] font-medium font-montserrat text-[#425466] bg-transparent"
                        format="YYYY-MM-DD"
                        style={{
                            outline: "none",
                            backgroundColor: "transparent",
                            color: theme.colors.text.secondary,
                            fontWeight: theme.text.bold.sm2,
                            fontFamily: "Montserrat",
                            height: "30px"
                        }}
                        picker="year"
                        value={selectedDate ? dayjs(selectedDate) : undefined}
                        onChange={(value) => handleMonthChange(value?.format("YYYY-MM-DD") || "")}
                    />
                </div>

                {/** Chart */}
                <div className="ml-[-10px] mt-[-10px]">
                    <ChartComponent
                        isLineChartDataPending={isMetricsPending}
                        lineChartSeries={lineChartSeries}
                        categories={categories}
                    />
                </div>
            </div>
        </SlideIn>
    )
}
export default LineChart