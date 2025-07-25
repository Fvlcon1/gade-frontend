import Input from "@components/ui/input/input";
import { useState } from "react";
import { IoReloadOutline, IoSearch } from "react-icons/io5";
import { useTheme } from "@styles/theme-context";
import Dropdown from "@components/ui/dropdown/dropdown";
import { DropdownItem } from "@/utils/@types";
import { BiChevronDown } from "react-icons/bi";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { FaUserShield } from "react-icons/fa";
import OutlineButton from "@components/ui/button/outlineButton";
import { useAlertsContext } from "../../context/alert-context";

const Controls = () => {
    const { refetchAlerts, selectedStatus, selectedSeverity, setSelectedStatus, setSelectedSeverity } = useAlertsContext()
    const {theme} = useTheme()
    const handleStatusChange = (status: string) => {
        setSelectedStatus(status)
    }

    const statusOptions: DropdownItem[] = [
        { key: "1", label: "All Status", onClick: () => handleStatusChange(''), isSelected: selectedStatus === null || selectedStatus === '' },
        { key: "2", label: "Open", onClick: () => handleStatusChange('Open'), isSelected: selectedStatus === 'Open' },
        { key: "3", label: "Under Review", onClick: () => handleStatusChange('Under Review'), isSelected: selectedStatus === 'Under Review' },
        { key: "4", label: "Closed", onClick: () => handleStatusChange('Closed'), isSelected: selectedStatus === 'Closed' },
    ]

    const severityOptions: DropdownItem[] = [
        { key: "1", label: "All Severity", onClick: () => handleSeverityChange(''), isSelected: selectedSeverity === null || selectedSeverity === '' },
        { key: "2", label: "High", onClick: () => handleSeverityChange('High'), isSelected: selectedSeverity === 'High' },
        { key: "3", label: "Medium", onClick: () => handleSeverityChange('Medium'), isSelected: selectedSeverity === 'Medium' },
        { key: "4", label: "Low", onClick: () => handleSeverityChange('Low'), isSelected: selectedSeverity === 'Low' },
    ]

    const handleSeverityChange = (severity: string) => {
        setSelectedSeverity(severity)
    }
    return (
        <>
            <div className="w-full flex gap-2 justify-center items-center">
                <div className="flex gap-2 w-[1024px] items-center">
                    {/* <Input
                        placeholder="Search reports"
                        value={searchValue}
                        setValue={setSearchValue}
                        PreIcon={<IoSearch color={theme.colors.text.tetiary} />}
                        className="!max-w-[500px]"
                        borderColor={theme.colors.border.secondary}
                    /> */}

                    <Dropdown
                        menuItems={statusOptions}
                    >
                        <Input
                            placeholder="All Status"
                            value={selectedStatus || ""}
                            setValue={handleStatusChange}
                            PostIcon={<BiChevronDown color={theme.colors.text.tetiary} />}
                            PreIcon={<HiOutlineStatusOnline color={theme.colors.text.secondary} />}
                            borderColor={theme.colors.border.secondary}
                        />
                    </Dropdown>

                    <Dropdown
                        menuItems={severityOptions}
                    >
                        <Input
                            placeholder="All Severity"
                            value={selectedSeverity || ""}
                            setValue={handleSeverityChange}
                            PostIcon={<BiChevronDown color={theme.colors.text.tetiary} />}
                            PreIcon={<FaUserShield color={theme.colors.text.secondary} />}
                            borderColor={theme.colors.border.secondary}
                        />
                    </Dropdown>

                    <div className="flex gap-2">
                        <OutlineButton
                            text="Refresh"
                            icon={<IoReloadOutline />}
                            onClick={() => refetchAlerts()}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
export default Controls