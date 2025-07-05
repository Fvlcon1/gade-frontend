import Text from "@styles/components/text"
import theme from "@styles/theme"
import Input from "@components/ui/input/input"
import { LuSunMoon, LuChevronDown } from "react-icons/lu"
import { CiLight, CiDark } from "react-icons/ci"
import Dropdown from "@components/ui/dropdown/dropdown"
import { DropdownItem } from "@/utils/@types"
import { BiCurrentLocation } from "react-icons/bi"

const CoordinateFormat = () => {
    const items: DropdownItem[] = [
        {
            key: "decimal",
            label: "Decimal",
        },
        {
            key: "degree",
            label: "Degree",
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
                    value="Decimal"
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