import Text from "@styles/components/text"
import { IoStatsChart } from "react-icons/io5"
import { BsFillInfoCircleFill } from "react-icons/bs"
import { useTheme } from "@styles/theme-context"
import { useDashboardContext } from "@/app/dashboard/context/dashboard-context"

const Header = () => {
    const {theme} = useTheme()
    const {reportedCasesChange} = useDashboardContext()
    return (
        <div>
            <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-[20px] h-[20px] rounded-sm bg-main-primary/20 flex items-center justify-center">
                                <IoStatsChart
                                    color={theme.darkColor}
                                    size={12}
                                />
                            </div>
                            <Text
                                bold={theme.text.bold.md}
                                textColor={theme.darkColor}
                            >
                                Recent Reports
                            </Text>
                        </div>
            
                        <div className="flex items-center gap-2 pr-2 border-[1px] px-1 py-1 rounded-full border-border-primary">
                            <div className="p-1.5 rounded-full bg-main-primary/20 flex items-center justify-center">
                                <BsFillInfoCircleFill
                                    color={theme.darkColor}
                                    className="shadow-lg"
                                    size={12}
                                />
                            </div>
                            <Text
                                textColor={theme.darkColor}
                            >
                                {reportedCasesChange?.increasePercent}% increase in reported cases this month compared to last month
                            </Text>
                        </div>
                    </div>
        </div>
    )
}
export default Header