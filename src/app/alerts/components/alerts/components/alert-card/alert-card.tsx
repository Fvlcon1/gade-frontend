import Text from "@styles/components/text"
import { BsThreeDots } from "react-icons/bs"
import ClickableTab from "@components/ui/clickable/clickabletab"
import getDate, { getRelativeTime } from "@/utils/getDate"
import { getStatusBgClass, getStatusTextColor, getSeverityBgClass, getSeverityColor } from "../styles"
import Dropdown from "@components/ui/dropdown/dropdown"
import { DropdownItem } from "@/utils/@types"
import { BsTrash } from "react-icons/bs"
import { FaAngleDown, FaBalanceScale, FaSearch, FaTrash } from "react-icons/fa"
import { GrSync } from "react-icons/gr"
import { FaMapMarkerAlt } from "react-icons/fa"
import UpdateStatusModal from "../update-status-modal"
import { useState } from "react"
import ConfirmationModal from "@components/ui/modals/confirmation-modal/confirmation-modal"
import { useRouter } from "next/navigation"
import { useTheme } from "@styles/theme-context"
import { GoAlertFill } from "react-icons/go"
import { FaClock } from "react-icons/fa"
import Divider from "@components/ui/divider/divider"
import { HiDocumentReport } from "react-icons/hi"
import Button from "@components/ui/button/button"
import { MdMap } from "react-icons/md"
import { hexOpacity } from "@/utils/hexOpacity"
import { ReactNode } from 'react';
import Modal1 from "@components/ui/modals/modal-1"
import Input from "@components/ui/input/input"
import { IoClose, IoSearch } from "react-icons/io5"
import { departmentList } from "@/utils/constants"

const AlertCard = ({
    alert,
    alertIsFetching
}: {
    alert: any,
    alertIsFetching: boolean
}) => {
    const router = useRouter()
    const [updateStatusModalVisible, setUpdateStatusModalVisible] = useState(false)
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [isHover, setIsHover] = useState(false)
    const [isReportModalVisible, setIsReportModalVisible] = useState(false)
    const [isAuthoritiesModalVisible, setIsAuthoritiesModalVisible] = useState(false)
    const { theme } = useTheme()

    const dropdownOptions: DropdownItem[] = [
        { key: "1", icon: <GrSync size={12} color={theme.colors.text.secondary} />, label: "Update status", onClick: () => { setUpdateStatusModalVisible(true) } },
        { key: "2", icon: <FaMapMarkerAlt size={12} color={theme.colors.text.secondary} />, label: "View on map", onClick: () => { handleViewOnMap(alert) } },
        { key: "divider-1", type: "divider" },
        { key: "3", label: <Text textColor={"#d4514a"}>Delete</Text>, icon: <FaTrash size={12} color={"#d4514a"} />, onClick: () => { setDeleteModalVisible(true) } },
    ]

    const handleViewOnMap = (alert: any) => {
        router.push(`/map?lat=${alert.location.lat}&lon=${alert.location.lon}&zoom=14&alert=${alert.id}`);
    }

    const Severity = () => {
        return (
            <div
                className={`w-fit flex px-2 py-1 h-fit rounded`}
                style={{
                    backgroundColor: getSeverityColor("HIGH") + hexOpacity(20)
                }}
            >
                <Text
                    textColor={getSeverityColor("HIGH")}
                // bold={theme.text.bold.md}
                >
                    High
                </Text>
            </div>
        )
    }

    const Content = () => {
        return (
            <div className="flex gap-2 flex-1 justify-between">
                <div className="flex flex-col gap-1">
                    <Text
                        size={theme.text.size.body2}
                        bold={theme.text.bold.md}
                    >
                        Potential illegal mining activity detected
                    </Text>
                    <Text>
                        Satellite imagery shows new activity in protected area
                    </Text>
                    <div className="flex gap-3 mt-1 items-center">
                        <div className="flex gap-1 items-center">
                            <FaClock size={12} color={theme.colors.text.tetiary} />
                            <Text textColor={theme.colors.text.tetiary}>
                                10 minutes ago
                            </Text>
                        </div>
                        <div className="flex gap-1 items-center">
                            <FaMapMarkerAlt size={12} color={theme.colors.text.tetiary} />
                            <Text textColor={theme.colors.text.tetiary}>
                                6.2350 N, 0.4813 W
                            </Text>
                        </div>
                    </div>
                </div>
                <Severity />
            </div>
        )
    }

    const Receipients = () => {
        return (
            <Text textColor={theme.colors.text.tetiary}>
                Receipients:
                <Text>
                    Police, Forestry commission
                </Text>
            </Text>
        )
    }

    const Chip = ({
        onClick,
        value,
    }: {
        onClick: () => void,
        value: string,
    }) => {
        return (
            <div
                className="flex rounded-full items-center max-w-[240px] gap-1 px-3 py-1 border-[1px] border-main-primary/50 cursor-pointer hover:bg-bg-tetiary"
                onClick={onClick}
            >
                <Text 
                    ellipsis
                    textColor={theme.colors.main.primary}
                >
                    {value}
                </Text>
                <IoClose
                    size={16}
                    color={theme.colors.main.primary}
                />
            </div>
        )
    }

    const AuthoritiesModal = () => {
        const [search, setSearch] = useState("")
        const [selectedAuthorities, setSelectedAuthorities] = useState<string[]>([])
        const authorities : DropdownItem[] = departmentList.map((department, index) => ({
            key: index.toString(),
            label: department,
            isSelected: selectedAuthorities.includes(department),
            onClick: () => setSelectedAuthorities(prev => [...prev, department])
        }))

        return (
            <Modal1
                isVisible={isAuthoritiesModalVisible}
                close={() => setIsAuthoritiesModalVisible(false)}
                title="Forward to authorities"
                description="Please select the authorities to forward to"
                icon={<FaBalanceScale size={16} color="white" />}
                ctaText="Forward"
                ctaAction={() => { }}
            >
                <Dropdown
                    menuItems={authorities}
                    onChange={(value) => setSelectedAuthorities(prev => [...prev, value])}
                >
                    <Input
                        placeholder="Search authorities..."
                        PreIcon={<IoSearch size={16} color={theme.colors.text.tetiary} />}
                        PostIcon={<FaAngleDown size={16} color={theme.colors.text.tetiary} />}
                        value={search}
                        setValue={setSearch}
                    />
                </Dropdown>
                <div className="flex gap-2 flex-wrap">
                    {
                        selectedAuthorities.map((authority, index) => (
                            <Chip
                                key={index}
                                onClick={() => setSelectedAuthorities(prev => prev.filter((item) => item !== authority))}
                                value={authority}
                            />
                        ))
                    }
                </div>
            </Modal1>
        )
    }

    const ReportModal = () => {
        return (
            <Modal1
                isVisible={isReportModalVisible}
                close={() => setIsReportModalVisible(false)}
                title="Generate Report"
                description="Please fill the form below to generate a report"
                icon={<HiDocumentReport size={16} color="white" />}
                ctaText="Generate Report"
                ctaAction={() => { }}
            >
                
            </Modal1>
        )
    }

    const Actions = () => {
        return (
            <div className="flex items-center gap-2">
                <ClickableTab onClick={() => setIsReportModalVisible(true)}>
                    <div className="flex items-center gap-1">
                        <HiDocumentReport size={16} color={theme.colors.text.tetiary} />
                        <Text>
                            Generate Report
                        </Text>
                    </div>
                </ClickableTab>
                <Text textColor={theme.colors.text.tetiary}>|</Text>
                <ClickableTab onClick={() => setIsAuthoritiesModalVisible(true)}>
                    <div className="flex items-center gap-1">
                        <FaBalanceScale size={16} color={theme.colors.text.tetiary} />
                        <Text>
                            Foward to authorities
                        </Text>
                    </div>
                </ClickableTab>
                <Text textColor={theme.colors.text.tetiary}>|</Text>
                <Button
                    text="View on map"
                    className="!h-fit !px-2"
                    icon={(<MdMap />)}
                    onClick={() => router.push(`/map`)}
                    // onClick={() => router.push(`/map?lat=${alert.location.lat}&lon=${alert.location.lon}&zoom=14&alert=${alert.id}`)}
                />
            </div>
        )
    }

    const Icon = () => {
        return (
            <div
                className="flex p-2 rounded-md justify-center items-center h-[30px] w-[30px] bg-bg-secondary"
                style={{
                    backgroundColor: getSeverityColor("HIGH") + hexOpacity(20)
                }}
            >
                <GoAlertFill
                    size={16}
                    color={getSeverityColor("HIGH")}
                />
            </div>
        )
    }

    const Popups = () => {
        return (
            <>
                <ReportModal />
                <AuthoritiesModal />
                <UpdateStatusModal
                    isVisible={updateStatusModalVisible}
                    close={() => setUpdateStatusModalVisible(false)}
                    currentStatus={alert?.status || "open"}
                    id={alert?.id || ""}
                />
                <ConfirmationModal
                    isVisible={deleteModalVisible}
                    close={() => setDeleteModalVisible(false)}
                    title="Delete Alert"
                    description="Are you sure you want to delete this alert?"
                    onConfirm={() => { }}
                    cta="Delete"
                    color="#d4514a"
                />
            </>
        )
    }

    const MainContainer = ({
        children
    }: {
        children?: ReactNode
    }) => {
        return (
            <div
                className={`relative ${alertIsFetching ? "cursor-wait" : ""} group p-2 flex w-[1024px] overflow-hidden cursor-pointer hover:bg-bg-primary-lighter duration-300 gap-2 justify-between rounded-xl border-[1px] border-border-primary`}
                onMouseOver={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                style={{
                    // backgroundColor: isHover ? getSeverityColor("HIGH") + hexOpacity(5) : "",
                    borderColor: isHover ? getSeverityColor("HIGH") + hexOpacity(20) : "",
                }}
            >
                {children}
            </div>
        )
    }

    const Rod = () => {
        const bgClass = "bg-[#EF4444]/50 group-hover:bg-[#EF4444]/70";
        const hoverClass = "w-[7px] group-hover:w-[14px]"

        return (
            <div className={`h-full ${bgClass} ${hoverClass} duration-200 rounded`} />
        )
    }

    return (
        <>
            <Popups />
            <MainContainer>
                <Rod />
                <div className="flex gap-2 flex-1 py-1">
                    <Icon />
                    <div className="flex flex-1 flex-col h-fit gap-3">
                        <Content />
                        <Divider />
                        <div className="flex justify-between gap-2 items-center flex-1">
                            <Receipients />
                            <Actions />
                        </div>
                    </div>
                </div>
            </MainContainer>
        </>
    )
}
export default AlertCard