import Text from "@styles/components/text"
import Input from "@components/ui/input/input"
import { LuSunMoon, LuChevronDown } from "react-icons/lu"
import { CiLight, CiDark } from "react-icons/ci"
import Dropdown from "@components/ui/dropdown/dropdown"
import { DropdownItem } from "@/utils/@types"
import { useSettingsContext } from "@/app/context/settings-context"
import { useTheme } from "@/app/styles/theme-context"

const Theme = () => {
    const { settings, saveSettings, storeSettings } = useSettingsContext()
    const { theme, setThemeColor } = useTheme()
    const appTheme = settings?.appTheme
    
    const handleThemeChange = (theme: string) => {
        const newSettings = {
            ...settings,
            appTheme: theme
        }
        storeSettings(newSettings)
        saveSettings(newSettings)

        switch (theme) {
            case "light":
                document.documentElement.classList.remove("dark");
                document.documentElement.classList.add("light");
                localStorage.setItem("theme", "light");
                setThemeColor("light");
                break;
            case "dark":
                document.documentElement.classList.remove("light");
                document.documentElement.classList.add("dark");
                localStorage.setItem("theme", "dark");
                setThemeColor("dark");
                break;
        }
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
            <div className="flex flex-col gap-1">
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