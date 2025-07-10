import Text from "@styles/components/text"
import theme from "@styles/theme"
import { Switch } from "antd"
import { useSettingsContext } from "@/app/context/settings-context"

const Notification = () => {
    const { settings, saveSettings, storeSettings } = useSettingsContext()
    const notificationsEnabled = settings?.notificationsEnabled

    const onChange = (checked: boolean) => {
        const newSettings = {
            ...settings,
            notificationsEnabled: checked
        }
        storeSettings(newSettings)
        saveSettings(newSettings)
    };

    return (
        <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-1">
                <Text>
                    Notification
                </Text>
                <Text textColor={theme.colors.text.tetiary}>
                    Turn on/off notifications
                </Text>
            </div>

            <Switch onChange={onChange} checked={notificationsEnabled} />
        </div>
    )
}
export default Notification