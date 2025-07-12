import Text from "@styles/components/text"
import theme from "@styles/theme"
import Input from "@components/ui/input/input"
import { LuChevronDown } from "react-icons/lu"
import Dropdown from "@components/ui/dropdown/dropdown"
import { DropdownItem } from "@/utils/@types"
import { useSettingsContext } from "@/app/context/settings-context"
import { useConfirmationModal } from "@components/ui/confirmation-modal/confirmation-modal-context"
import { BsInfoCircleFill } from "react-icons/bs"

const Units = () => {
    const { settings, saveSettings, storeSettings } = useSettingsContext()
    const showConfirmation = useConfirmationModal()
    const units = settings?.units
    
    const handleUnitsChange = (units: string) => {
        const newSettings = {
            ...settings,
            units: units
        }
        storeSettings(newSettings)
        saveSettings(newSettings)

        showConfirmation({
            title: "Units changed",
            description: "Page refresh required",
            cta: "Refresh",
            color: theme.colors.main.primary,
            onConfirm: () => window.location.reload()
        })
    }
    
    const items: DropdownItem[] = [
        {
            key: "metric",
            label: "Metric",
            onClick: () => handleUnitsChange("metric"),
            isSelected: units === "metric"
        },
        {
            key: "imperial",
            label: "Imperial",
            onClick: () => handleUnitsChange("imperial"),
            isSelected: units === "imperial"
        }, 
    ]
    return (
        <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-1">
                <Text>
                    Units
                </Text>
                <div className="flex items-center gap-1">
                    <BsInfoCircleFill size={13} color={theme.colors.text.tetiary} />
                    <Text textColor={theme.colors.text.tetiary}>
                        Page refresh required
                    </Text>
                </div>
            </div>
            <Dropdown
                menuItems={items}
                position="top-right"
            >
                <Input
                    placeholder="Select units"
                    value={units}
                    className="!w-[120px] !h-[35px]"
                    PostIcon={<LuChevronDown size={15} color={theme.colors.text.secondary} />}
                    inputProps={{
                        readOnly: true
                    }}
                />
            </Dropdown>
        </div>
    )
}
export default Units