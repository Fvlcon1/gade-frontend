import Text from "@styles/components/text"
import theme from "@styles/theme"
import Input from "@components/ui/input/input"
import { LuSunMoon, LuChevronDown } from "react-icons/lu"
import { CiLight, CiDark } from "react-icons/ci"
import Dropdown from "@components/ui/dropdown/dropdown"
import { DropdownItem } from "@/utils/@types"
import { useLeftPanelContext } from "@components/Layout/LeftPanel/context/context"

const Theme = () => {
    const { settings, setSettings } = useLeftPanelContext()
    const appTheme = settings?.appTheme
    
    const handleThemeChange = (theme: string) => {
        setSettings({
            ...settings,
            appTheme: theme
        })
    }
    const items: DropdownItem[] = [
        {
            key: "system",
            label: "System",
            onClick: () => handleThemeChange("system")
        },
        {
            key: "light",
            label: "Light",
            onClick: () => handleThemeChange("light")
        },
        {
            key: "dark",
            label: "Dark",
            onClick: () => handleThemeChange("dark")
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
                    value={appTheme}
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