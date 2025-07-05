import Text from "@styles/components/text"
import theme from "@styles/theme"
import Input from "@components/ui/input/input"
import { LuSunMoon, LuChevronDown } from "react-icons/lu"
import { CiLight, CiDark } from "react-icons/ci"
import Dropdown from "@components/ui/dropdown/dropdown"
import { DropdownItem } from "@/utils/@types"

const DefaultMapView = () => {
    const items: DropdownItem[] = [
        {
            key: "light",
            label: "Light",
            icon: <CiLight size={20} color={theme.colors.text.secondary} />
        },
        {
            key: "dark",
            label: "Dark",
            icon: <CiDark size={20} color={theme.colors.text.secondary} />
        }
    ]
    return (
        <div className="flex flex-col w-full gap-1">
            <div className="flex flex-col">
                <Text>
                    Default Map View
                </Text>
                <Text textColor={theme.colors.text.tetiary}>
                    Select default map view
                </Text>
            </div>
            <div className="flex items-center justify-between w-full gap-2">
                <div className="flex flex-col gap-1">
                    <Text textColor={theme.colors.text.tetiary} >Latitude</Text>
                    <Input
                        placeholder="Latitude"
                        value={3.9922}
                        type="number"
                        className="!w-[120px] !h-[35px]"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <Text textColor={theme.colors.text.tetiary} >Longitude</Text>
                    <Input
                        placeholder="Longitude"
                        value={-1.0022}
                        type="number"
                        className="!w-[120px] !h-[35px]"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <Text textColor={theme.colors.text.tetiary} >Zoom</Text>
                    <Input
                        placeholder="Zoom"
                        value={12}
                        type="number"
                        className="!w-[120px] !h-[35px]"
                    />
                </div>
            </div>
        </div>
    )
}
export default DefaultMapView