import Text from "@styles/components/text"
import theme from "@styles/theme"
import { Switch } from "antd"
import { useLeftPanelContext } from "@components/Layout/LeftPanel/context/context"

const Notification = () => {
    const { settings, setSettings } = useLeftPanelContext()
    const notificationsEnabled = settings?.notificationsEnabled

    const onChange = (checked: boolean) => {
        setSettings({
            ...settings,
            notificationsEnabled: checked
        })
    };

    return (
        <div className="flex items-center justify-between w-full">
            <div className="flex flex-col">
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