import Text from "@styles/components/text"
import theme from "@styles/theme"
import Input from "@components/ui/input/input"
import { LuSunMoon, LuChevronDown } from "react-icons/lu"
import { CiLight, CiDark } from "react-icons/ci"
import Dropdown from "@components/ui/dropdown/dropdown"
import { DropdownItem } from "@/utils/@types"
import { BiCurrentLocation } from "react-icons/bi"
import { useLeftPanelContext } from "@components/Layout/LeftPanel/context/context"

const CoordinateFormat = () => {
    const { settings, setSettings } = useLeftPanelContext()
    const coordinateFormat = settings?.coordinateFormat

    const handleCoordinateFormatChange = (format: string) => {
        setSettings({
            ...settings,
            coordinateFormat: format
        })
    }
    
    const items: DropdownItem[] = [
        {
            key: "dd",
            label: "dd (decimal degrees)",
            onClick: () => handleCoordinateFormatChange("dd")
        },
        {
            key: "dms",
            label: "dms (degree minutes seconds)",
            onClick: () => handleCoordinateFormatChange("dms")
        }
    ]
    return (
        <div className="flex items-center justify-between w-full">
            <div className="flex flex-col">
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