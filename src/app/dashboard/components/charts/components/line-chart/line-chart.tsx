import SlideIn from "@styles/components/slidein"
import Text from "@styles/components/text"
import theme from "@styles/theme"
import ChartComponent from "./chart-component"
import { DatePicker } from "antd"
import { useState } from "react"
import dayjs from "dayjs"
import useLineChart from "./hooks/useLineChart"

const LineChart = () => {
    const [selectedDate, setSelectedDate] = useState<string>("")
    const { lineChartSeries, isLineChartDataPending } = useLineChart()

    const handleMonthChange = (value: string) => {
        setSelectedDate(value)
    }

    return (
        <SlideIn direction="bottom" className="flex flex-1 w-full">
            <div className="w-full h-full flex flex-col gap-2 pl-4">
                <div className="w-full flex justify-between pr-4">
                    <div className="flex flex-col gap-[2px]">
                        <Text
                            textColor={theme.colors.main.primary}
                            bold={theme.text.bold.md}
                        >
                            Reported cases
                        </Text>
                        <Text textColor={theme.colors.text.tetiary}>
                            Cases reported over the past year
                        </Text>
                    </div>

                    <DatePicker
                        placeholder="Select Year"
                        className="z-10 h-[30px] font-medium font-montserrat text-[#425466] bg-transparent"
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
                        isLineChartDataPending={isLineChartDataPending}
                        lineChartSeries={lineChartSeries}
                    />
                </div>
            </div>
        </SlideIn>
    )
}
export default LineChart