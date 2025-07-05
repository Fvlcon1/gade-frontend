import Text from "@styles/components/text"
import theme from "@styles/theme"
import Input from "@components/ui/input/input"
import { LuSunMoon, LuChevronDown } from "react-icons/lu"
import { CiLight, CiDark } from "react-icons/ci"
import Dropdown from "@components/ui/dropdown/dropdown"
import { DropdownItem } from "@/utils/@types"
import { Switch } from "antd"
import { useState } from "react"

const Notification = () => {
    const [checked, setChecked] = useState(true);

    const onChange = (checked: boolean) => {
        setChecked(checked);
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

            <Switch onChange={onChange} checked={checked} />
        </div>
    )
}
export default Notification