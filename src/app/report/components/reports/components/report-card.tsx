import Text from "@styles/components/text"
import theme from "@styles/theme"
import { BsThreeDots } from "react-icons/bs"
import ClickableTab from "@components/ui/clickable/clickabletab"
import getDate from "@/utils/getDate"
import { getStatusBgClass, getStatusTextColor, getSeverityBgClass, getSeverityTextColor } from "./styles"
import Dropdown from "@components/ui/dropdown/dropdown"
import { DropdownItem } from "@/utils/@types"
import { BsTrash } from "react-icons/bs"
import { FaTrash } from "react-icons/fa"
import { GrSync } from "react-icons/gr"
import { FaMapMarkerAlt } from "react-icons/fa"
import UpdateStatusModal from "./update-status-modal"
import { useState } from "react"
import ConfirmationModal from "@components/ui/confirmation-modal/confirmation-modal"
import { useRouter } from "next/navigation"

const ReportCard = ({
    report,
    reportsIsFetching
}: {
    report: any,
    reportsIsFetching: boolean
}) => {
    const router = useRouter()
    const [updateStatusModalVisible, setUpdateStatusModalVisible] = useState(false)
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const dropdownOptions: DropdownItem[] = [
        { key: "1", icon: <GrSync size={12} color={theme.colors.text.secondary} />, label: "Update status", onClick: () => { setUpdateStatusModalVisible(true) } },
        { key: "2", icon: <FaMapMarkerAlt size={12} color={theme.colors.text.secondary} />, label: "View on map", onClick: () => { handleViewOnMap(report) } },
        { key: "divider-1", type: "divider" },
        { key: "3", label: <Text textColor={"#d4514a"}>Delete</Text>, icon: <FaTrash size={12} color={"#d4514a"} />, onClick: () => { setDeleteModalVisible(true) } },
    ]

    const handleViewOnMap = (report: any) => {
        router.push(`/map?lat=${report.location.lat}&lon=${report.location.lon}&zoom=14&report=${report.id}`);
    }

    return (
        <>
            <UpdateStatusModal
                isVisible={updateStatusModalVisible}
                close={() => setUpdateStatusModalVisible(false)}
                currentStatus={report.status.toLowerCase()}
                id={report.id}
            />
            <ConfirmationModal
                isVisible={deleteModalVisible}
                close={() => setDeleteModalVisible(false)}
                title="Delete Report"
                description="Are you sure you want to delete this report?"
                onConfirm={() => { }}
                cta="Delete"
                color="#d4514a"
            />
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

                    <Dropdown menuItems={dropdownOptions}>
                        <ClickableTab>
                            <BsThreeDots
                                color={theme.colors.text.tetiary}
                                size={15}
                            />
                        </ClickableTab>
                    </Dropdown>
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
        </>
    )
}
export default ReportCard