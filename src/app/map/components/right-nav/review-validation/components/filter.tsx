import Text from "@styles/components/text"
import { useReviewContext } from "../context/review-context"
import { useSpatialStore } from "@/lib/store/spatial-store"
import { IoSearch } from "react-icons/io5"
import Divider from "@components/ui/divider/divider"
import { useTheme } from "@/app/styles/theme-context"
import Input from "@components/ui/input/input"
import { useState } from "react"
import { FaChevronDown } from "react-icons/fa"
import Dropdown from "@components/ui/dropdown/dropdown"
import { DropdownItem } from "@/utils/@types"

type Status = "All" | "Open" | "In Review" | "False Positive" | "Closed"

const Chip = ({
    value,
    isSelected,
    onClick
}) => {
    const { theme } = useTheme()

    return (
        <div
            className={`flex items-center gap-2 cursor-pointer duration-300 rounded-full border-[1px] ${isSelected ? "border-main-primary bg-main-primary/10" : "border-border-primary hover:bg-bg-tetiary"} px-2 py-1`}
            onClick={() => onClick?.()}
        >
            <Text
                textColor={isSelected ? theme.colors.main.primary : theme.colors.text.secondary}
                bold={isSelected ? theme.text.bold.md2 : theme.text.bold.sm2}
            >
                {isSelected ? `✓ ${value}` : value}
            </Text>
        </div>
    )
}

const Filter = () => {
    const { severities, selectedSeverity, setSelectedSeverity, statuses, selectedStatus, setSelectedStatus } = useReviewContext()
    const { reviewValidationSearchValue, setReviewValidationSearchValue, applyFilters } = useSpatialStore()
    const { theme } = useTheme()

    const statusOptions: DropdownItem[] = statuses.map((status, index) => {
        return {
            key: index.toString(),
            label: status,
            value: status.toString(),
            isSelected: selectedStatus === status
        }
    })

    return (
        <div className="flex flex-col gap-3 px-4">
            {/* <Input 
                placeholder="Search"
                value={reviewValidationSearchValue}
                PreIcon={<IoSearch color={theme.colors.text.tetiary} />}
                onChange={(e) => {
                    setReviewValidationSearchValue(e.target.value)
                    applyFilters()
                }}
                className="!h-[35px] !px-2"
            /> */}
            <Dropdown
                menuItems={statusOptions}
                onChange={setSelectedStatus}
                position="bottom-right"
            >
                <Input
                    placeholder="Select Status"
                    value={selectedStatus}
                    PreIcon={<IoSearch color={theme.colors.text.tetiary} />}
                    onChange={(e) => {
                        setSelectedStatus(e.target.value)
                        applyFilters()
                    }}
                    PostIcon={<FaChevronDown size={11} color={theme.colors.text.tetiary} />}
                    inputProps={{
                        readOnly: true
                    }}
                    className="!h-[35px] !px-3 dark:!shadow-xs dark:!shadow-white/5"
                />
            </Dropdown>

            <div className="flex gap-2">
                {
                    severities.map((severity, index) => {
                        return (
                            <Chip
                                key={index}
                                value={severity}
                                isSelected={selectedSeverity === severity}
                                onClick={() => setSelectedSeverity(severity)}
                            />
                        )
                    })
                }
            </div>
            <Divider className="my-2" />
        </div>
    )
}
export default Filter