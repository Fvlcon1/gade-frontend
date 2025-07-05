import Text from "@styles/components/text"
import theme from "@styles/theme"
import Input from "@components/ui/input/input"
import { LuSunMoon, LuChevronDown } from "react-icons/lu"
import { CiLight, CiDark } from "react-icons/ci"
import Dropdown from "@components/ui/dropdown/dropdown"
import { DropdownItem } from "@/utils/@types"

const Units = () => {
    const items: DropdownItem[] = [
        {
            key: "meters",
            label: "Meters",
        },
        {
            key: "kilometers",
            label: "Kilometers",
        },
        {
            key: "feet",
            label: "Feet",
        },
        {
            key: "yards",
            label: "Yards",
        },
        {
            key: "miles",
            label: "Miles",
        }
    ]
    return (
        <div className="flex items-center justify-between w-full">
            <div className="flex flex-col">
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
                    value="Meters"
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