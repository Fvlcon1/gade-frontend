import Input from "@components/ui/input/input";
import { useState } from "react";
import { IoReloadOutline, IoSearch } from "react-icons/io5";
import theme from "@styles/theme";
import Dropdown from "@components/ui/dropdown/dropdown";
import { DropdownItem } from "@/utils/@types";
import { BiChevronDown } from "react-icons/bi";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { FaUserShield } from "react-icons/fa";
import OutlineButton from "@components/ui/button/outlineButton";
import { useReportsContext } from "../../context/report-context";

const Controls = () => {
    const [searchValue, setSearchValue] = useState('');
    const [statusValue, setStatusValue] = useState('All Status');
    const [priorityValue, setPriorityValue] = useState('All Priority');
    const { refetchReports, selectedStatus, selectedPriority, setSelectedStatus, setSelectedPriority } = useReportsContext()

    const handleStatusChange = (status: string) => {
        setStatusValue(status)
        setSelectedStatus(status)
    }

    const statusOptions: DropdownItem[] = [
        { key: "2", label: "Open", onClick: () => handleStatusChange('Open'), isSelected: selectedStatus === 'Open' },
        { key: "3", label: "In Review", onClick: () => handleStatusChange('In Review'), isSelected: selectedStatus === 'In Review' },
        { key: "4", label: "Resolved", onClick: () => handleStatusChange('Resolved'), isSelected: selectedStatus === 'Resolved' },
    ]

    const priorityOptions: DropdownItem[] = [
        { key: "2", label: "High", onClick: () => handlePriorityChange('High'), isSelected: selectedPriority === 'High' },
        { key: "3", label: "Medium", onClick: () => handlePriorityChange('Medium'), isSelected: selectedPriority === 'Medium' },
        { key: "4", label: "Low", onClick: () => handlePriorityChange('Low'), isSelected: selectedPriority === 'Low' },
    ]

    const handlePriorityChange = (priority: string) => {
        setPriorityValue(priority)
        setSelectedPriority(priority)
    }
    return (
        <>
            <div className="w-full flex gap-2 justify-center items-center">
                <div className="flex gap-2 w-[1024px] items-center">
                    <Input
                        placeholder="Search reports"
                        value={searchValue}
                        setValue={setSearchValue}
                        PreIcon={<IoSearch color={theme.colors.text.tetiary} />}
                        className="!max-w-[500px]"
                        borderColor={theme.colors.border.secondary}
                    />

                    <Dropdown
                        menuItems={statusOptions}
                    >
                        <Input
                            placeholder="Status"
                            value={statusValue}
                            setValue={handleStatusChange}
                            PostIcon={<BiChevronDown color={theme.colors.text.tetiary} />}
                            PreIcon={<HiOutlineStatusOnline color={theme.colors.text.secondary} />}
                            borderColor={theme.colors.border.secondary}
                        />
                    </Dropdown>

                    <Dropdown
                        menuItems={priorityOptions}
                    >
                        <Input
                            placeholder="Priority"
                            value={priorityValue}
                            setValue={handlePriorityChange}
                            PostIcon={<BiChevronDown color={theme.colors.text.tetiary} />}
                            PreIcon={<FaUserShield color={theme.colors.text.secondary} />}
                            borderColor={theme.colors.border.secondary}
                        />
                    </Dropdown>

                    <div className="flex gap-2">
                        <OutlineButton
                            text="Refresh"
                            icon={<IoReloadOutline />}
                            onClick={() => refetchReports()}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
export default Controls