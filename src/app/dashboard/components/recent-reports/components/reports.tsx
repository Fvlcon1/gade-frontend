import ClickableTab from "@components/ui/clickable/clickabletab"
import Text from "@styles/components/text"
import theme from "@styles/theme"
import { BsThreeDots } from "react-icons/bs"

const getStatusBgClass = (status: string) => {
    switch (status) {
        case "under review":
            return "bg-[#FCF5E1]"
        case "verified":
            return "bg-blue-500"
        default:
            return "bg-gray-500"
    }
}

const getStatusTextColor = (status: string) => {
    switch (status) {
        case "under review":
            return "#D77F03"
        case "verified":
            return "blue"
        default:
            return "gray"
    }
}   

const ReportItem = () => {
    return (
        <div className="flex items-center gap-2 justify-between py-2 pl-3 pr-4 rounded-xl bg-bg-primary-lighter border-[1px] border-border-primary">
            <div className="flex flex-col">
                <Text
                    bold={theme.text.bold.md}
                >
                    Large-scale minging operation
                </Text>
                <Text>
                    Suspected galamsey operation behind the abandoned cocoa farm.
                </Text>
                <Text
                    textColor={theme.colors.text.tetiary}
                >
                    Obuasi | 5.6037° N, 0.1870° W
                </Text>
            </div>

            <div className={`flex px-2 py-1 rounded-full ${getStatusBgClass("under review")}`}>
                <Text
                    textColor={getStatusTextColor("under review")}
                >
                    Under Review
                </Text>
            </div>

            <Text
                textColor={theme.colors.text.tetiary}
            >
                2 hours ago
            </Text>

            <ClickableTab>
                <BsThreeDots
                    color={theme.colors.text.tetiary}
                    size={15}
                />
            </ClickableTab>
        </div>
    )
}

const Reports = () => {
    return (
        <div className="flex flex-col gap-3">
            {
                Array.from({ length: 6 }).map((_, index) => (
                    <ReportItem key={index} />
                ))
            }
        </div>
    )
}
export default Reports