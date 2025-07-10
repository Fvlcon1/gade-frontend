import Text from "@styles/components/text"
import theme from "@styles/theme"
import Input from "@components/ui/input/input"
import { LuSunMoon, LuChevronDown } from "react-icons/lu"
import { CiLight, CiDark } from "react-icons/ci"
import Dropdown from "@components/ui/dropdown/dropdown"
import { DropdownItem } from "@/utils/@types"
import { useSettingsContext } from "@/app/context/settings-context"

const Units = () => {
    const { settings, saveSettings, storeSettings } = useSettingsContext()
    const units = settings?.units
    
    const handleUnitsChange = (units: string) => {
        const newSettings = {
            ...settings,
            units: units
        }
        storeSettings(newSettings)
        saveSettings(newSettings)
    }
    
    const items: DropdownItem[] = [
        {
            key: "metric",
            label: "Metric",
            onClick: () => handleUnitsChange("metric")
        },
        {
            key: "imperial",
            label: "Imperial",
            onClick: () => handleUnitsChange("imperial")
        }, 
    ]
    return (
        <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-1">
                <Text>
                    Units
                </Text>
                <Text textColor={theme.colors.text.tetiary}>
                    Select units preference
                </Text>
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