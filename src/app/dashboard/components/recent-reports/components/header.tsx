import Text from "@styles/components/text"
import theme from "@styles/theme"
import { IoStatsChart } from "react-icons/io5"
import { BsFillInfoCircleFill } from "react-icons/bs"

const Header = () => {
    return (
        <div>
            <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-[20px] h-[20px] rounded-sm bg-main-primary/20 flex items-center justify-center">
                                <IoStatsChart
                                    color={theme.colors.main.primary}
                                    size={12}
                                />
                            </div>
                            <Text
                                bold={theme.text.bold.md}
                                textColor={theme.colors.main.primary}
                            >
                                Recent Reports
                            </Text>
                        </div>
            
                        <div className="flex items-center gap-2 pr-2 border-[1px] px-1 py-1 rounded-full border-border-primary">
                            <div className="p-1.5 rounded-full bg-main-primary/20 flex items-center justify-center">
                                <BsFillInfoCircleFill
                                    color={theme.colors.main.primary}
                                    className="shadow-lg"
                                    size={12}
                                />
                            </div>
                            <Text
                                textColor={theme.colors.main.primary}
                            >
                                200% increase in illegal mining activity detected this month compared to the previous data.
                            </Text>
                        </div>
                    </div>
        </div>
    )
}
export default Header