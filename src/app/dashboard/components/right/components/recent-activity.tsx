import Text from "@styles/components/text"
import theme from "@styles/theme"
import { Fragment } from "react"
import { IoMdPulse } from "react-icons/io"
import { MdPieChart } from "react-icons/md"

const Divider = () => {
    return (
        <div className="w-full pl-12">
            <div className="w-full h-0.25 bg-border-primary" />
        </div>
    )
}

const Activity = () => {
    return (
        <div className="flex items-center gap-3">
            <div className="w-[40px] h-[40px] rounded-full bg-main-primary/10 flex items-center justify-center">
                <MdPieChart
                    color={theme.colors.main.primary}
                    size={20}
                />
            </div>
            <div className="flex flex-col flex-1 gap-1 pr-4">
                <Text lineHeight={1.4}>
                    Email notifications sent to <b>Ghana police, NSB and 2 others</b>
                </Text>
                <Text
                    textColor={theme.colors.text.tetiary}
                >
                    2 hours ago
                </Text>
            </div>
        </div>
    )
}

const RecentActivity = () => {
    return (
        <div className="flex flex-col gap-4 pl-4">
            {/* header */}
            <div className="flex items-center gap-2">
                <div className="w-[20px] h-[20px] rounded-sm bg-main-primary/15 flex items-center justify-center">
                    <IoMdPulse
                        color={theme.colors.main.primary}
                        size={12}
                    />
                </div>
                <Text
                    bold={theme.text.bold.md}
                    textColor={theme.colors.main.primary}
                >
                    Recent Activity
                </Text>
            </div>

            <div className="flex flex-col gap-4">
                {
                    Array.from({ length: 4 }).map((_, index) => (
                        <Fragment key={index}>
                            <Activity />
                            {index < 3 && <Divider />}
                        </Fragment>
                    ))
                }
            </div>
        </div>
    )
}
export default RecentActivity