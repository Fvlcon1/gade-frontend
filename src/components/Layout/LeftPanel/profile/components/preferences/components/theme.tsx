import Text from "@styles/components/text"
import theme from "@styles/theme"
import Input from "@components/ui/input/input"
import { LuSunMoon, LuChevronDown } from "react-icons/lu"
import { CiLight, CiDark } from "react-icons/ci"
import Dropdown from "@components/ui/dropdown/dropdown"
import { DropdownItem } from "@/utils/@types"

const Theme = () => {
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
        <div className="flex items-center justify-between w-full">
            <div className="flex flex-col">
                <Text>
                    Theme
                </Text>
                <Text textColor={theme.colors.text.tetiary}>
                    Select theme preference
                </Text>
            </div>
            <Dropdown
                menuItems={items}
            >
                <Input
                    placeholder="Select theme"
                    value="Light"
                    className="!w-[120px] !h-[35px]"
                    PreIcon={<LuSunMoon size={20} color={theme.colors.text.secondary} />}
                    PostIcon={<LuChevronDown size={15} color={theme.colors.text.secondary} />}
                    inputProps={{
                        readOnly: true
                    }}
                />
            </Dropdown>
        </div>
    )
}
export default Theme