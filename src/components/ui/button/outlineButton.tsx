import theme from "@styles/theme"
import Button from "./button"
import { ButtonProps } from "@/utils/@types"

const OutlineButton = (props: ButtonProps) => {
    return <Button 
        {...props}
        className={`!bg-transparent hover:!bg-bg-secondary border-[1px] border-main-primary ${props.className}`}
        color={theme.colors.main.primary}
    />
}

export default OutlineButton