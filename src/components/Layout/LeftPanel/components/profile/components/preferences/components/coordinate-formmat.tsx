import Text from "@styles/components/text"
import theme from "@styles/theme"
import Input from "@components/ui/input/input"
import { LuSunMoon, LuChevronDown } from "react-icons/lu"
import { CiLight, CiDark } from "react-icons/ci"
import Dropdown from "@components/ui/dropdown/dropdown"
import { DropdownItem } from "@/utils/@types"
import { BiCurrentLocation } from "react-icons/bi"
import { useSettingsContext } from "@/app/context/settings-context"

const CoordinateFormat = () => {
    const { settings, saveSettings, storeSettings } = useSettingsContext()
    const coordinateFormat = settings?.coordinateFormat

    const handleCoordinateFormatChange = (format: string) => {
        const newSettings = {
            ...settings,
            coordinateFormat: format
        }
        storeSettings(newSettings)
        saveSettings(newSettings)
    }
    
    const items: DropdownItem[] = [
        {
            key: "dd",
            label: "DD (decimal degrees)",
            onClick: () => handleCoordinateFormatChange("dd"),
            isSelected: coordinateFormat === "dd"
        },
        {
            key: "dms",
            label: "DMS (degree minutes seconds)",
            onClick: () => handleCoordinateFormatChange("dms"),
            isSelected: coordinateFormat === "dms"
        }
    ]
    return (
        <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-1">
                <Text>
                    Coordinate Format
                </Text>
                <Text textColor={theme.colors.text.tetiary}>
                    Select coordinate format
                </Text>
            </div>
            <Dropdown
                menuItems={items}
            >
                <Input
                    placeholder="Select coordinate format"
                    value={coordinateFormat}
                    className="!w-[150px] !h-[35px]"
                    PreIcon={<BiCurrentLocation size={20} color={theme.colors.text.secondary} />}
                    PostIcon={<LuChevronDown size={15} color={theme.colors.text.secondary} />}
                    inputProps={{
                        readOnly: true
                    }}
                />
            </Dropdown>
        </div>
    )
}
export default CoordinateFormat