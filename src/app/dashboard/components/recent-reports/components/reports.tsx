'use client'

import { useDashboardContext } from "@/app/dashboard/context/dashboard-context"
import { Report } from "@/app/dashboard/utils/types"
import ClickableTab from "@components/ui/clickable/clickabletab"
import Text from "@styles/components/text"
import theme from "@styles/theme"
import { BsThreeDots } from "react-icons/bs"
import ReportsSkeleton from "./reports-skeleton"
import getDate from "@/utils/getDate"
import { ReportStatus } from "@/app/dashboard/utils/types"

const statusMapping = {
    OPEN : "Open",
    CLOSED : "Closed",
    IN_REVIEW : "Under Review"
}

const getStatusBgClass = (status: ReportStatus) => {
    switch (status) {
        case ReportStatus.OPEN:
            return "bg-yellow-100";
        case ReportStatus.IN_REVIEW:
            return "bg-blue-100";
        case ReportStatus.RESOLVED:
            return "bg-green-100";
        case ReportStatus.CLOSED:
            return "bg-gray-200";
        default:
            return "bg-gray-100";
    }
};

const getStatusTextColor = (status: ReportStatus) => {
    switch (status) {
        case ReportStatus.OPEN:
            return "#D97706"; // amber-600
        case ReportStatus.IN_REVIEW:
            return "#2563EB"; // blue-600
        case ReportStatus.RESOLVED:
            return "#059669"; // green-600
        case ReportStatus.CLOSED:
            return "#4B5563"; // gray-600
        default:
            return "#6B7280"; // gray-500
    }
};

const ReportItem = ({ report }: { report: Report }) => {
    return (
        <div className="flex items-center gap-2 justify-between py-2 pl-3 pr-4 rounded-xl bg-bg-primary-lighter border-[1px] border-border-primary">
            <div className="flex flex-col gap-1 w-[60%]">
                <Text
                    bold={theme.text.bold.md}
                    size={theme.text.size.body2}
                >
                    {report.title}
                </Text>
                <Text>
                    {report.description}
                </Text>
                <Text
                    textColor={theme.colors.text.tetiary}
                >
                    {report.location.lat} | {report.location.lon}
                </Text>
            </div>

            <div className="flex w-[200px] justify-center">
                <div className={`flex px-2 py-1.5 rounded-full ${getStatusBgClass(report.status)}`}>
                    <Text
                        textColor={getStatusTextColor(report.status)}
                    >
                        {statusMapping[report.status]}
                    </Text>
                </div>
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
    )
}

const Reports = () => {
    const { reports, isReportsPending } = useDashboardContext()

    if(isReportsPending) {
        return (
            <div className="flex flex-col gap-3">
                {
                    Array.from({ length: 3 }).map((_, index) => (
                        <ReportsSkeleton key={index} />
                    ))
                }
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-3">
            {
                reports?.map((report, index) => (
                    <ReportItem key={index} report={report} />
                ))
            }
        </div>
    )
}
export default Reports