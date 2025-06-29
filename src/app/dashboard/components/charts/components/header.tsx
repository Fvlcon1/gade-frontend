import theme from "@styles/theme"
import Text from "@styles/components/text"
import { IoStatsChart, IoLayers } from "react-icons/io5"

const Header = () => {
    return (
        <div className="px-3 py-3 flex w-full justify-between items-center">

            {/* Left */}
            <div className="flex items-center gap-4">
                {/* Title */}
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
                        Analytics Charts
                    </Text>
                </div>
                <Text textColor={theme.colors.text.tetiary}> | </Text>
                <Text
                    textColor={theme.colors.text.tetiary}
                >
                    Visual insights into key performance and trends
                </Text>
            </div>

            <div className="w-[20px] h-[20px] rounded-sm bg-main-primary/20 flex items-center justify-center">
                <IoLayers
                    color={theme.colors.main.primary}
                    size={12}
                />
            </div>
        </div>
    )
}
export default Header