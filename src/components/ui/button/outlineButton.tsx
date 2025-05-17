import theme from "@styles/theme"
import Button from "./button"
import { ButtonProps } from "@/utils/@types"

const OutlineButton = (props: ButtonProps) => {
    return <Button 
        className="!bg-transparent hover:!bg-bg-secondary border-[1px] border-main-primary"
        color={theme.colors.main.primary}
        {...props}
    >
        {props.children}
    </Button>
}

export default OutlineButton