import Text from "@styles/components/text"
import theme from "@styles/theme"
import { BsThreeDots } from "react-icons/bs"
import ClickableTab from "@components/ui/clickable/clickabletab"
import getDate from "@/utils/getDate"
import { getStatusBgClass, getStatusTextColor, getSeverityBgClass, getSeverityTextColor } from "./styles"

const ReportCard = ({
    report,
    reportsIsFetching
}: {
    report: any,
    reportsIsFetching: boolean
}) => {
    return (
        <div className="flex flex-col">
            <div className={`relative ${reportsIsFetching ? "cursor-wait" : ""} flex w-[1024px] cursor-pointer hover:bg-bg-secondary duration-200 items-center gap-2 justify-between py-2 pl-3 pr-4 rounded-xl bg-bg-primary-lighter border-[1px] border-border-primary`}>
                <div className="flex flex-col w-[50%]">
                    <Text
                        bold={theme.text.bold.md}
                        size={theme.text.size.body2}
                    >
                        {report.title}
                    </Text>
                    <Text ellipsis>
                        {report.description}
                    </Text>
                    <Text
                        textColor={theme.colors.text.tetiary}
                    >
                        {report.location.lat} | {report.location.lon}
                    </Text>
                </div>

                <div className={`flex px-3 py-1 rounded-full ${getStatusBgClass(report.status)}`}>
                    <Text
                        textColor={getStatusTextColor(report.status)}
                        size={theme.text.size.xs}
                        bold={theme.text.bold.md}
                    >
                        {report.status}
                    </Text>
                </div>

                <Text
                    textColor={theme.colors.text.tetiary}
                >
                    {getDate(new Date(report.createdAt))}
                </Text>

                <ClickableTab>
                    <BsThreeDots
                        color={theme.colors.text.tetiary}
                        size={15}
                    />
                </ClickableTab>
            </div>

            <div className={`w-fit flex ml-6 rounded-b-xl px-3 py-1 ${getSeverityBgClass(report.severity)}`}>
                <Text
                    textColor={getSeverityTextColor(report.severity)}
                    size={theme.text.size.xs}
                    bold={theme.text.bold.md}
                >
                    {report.severity}
                </Text>
            </div>
        </div>
    )
}
export default ReportCard