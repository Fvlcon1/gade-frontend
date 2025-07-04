import { IconType } from "react-icons";
import Text from "@/app/styles/components/text";
import theme from "@/app/styles/theme";
import { ReactNode } from "react";
import { TypographySize } from "@styles/style.types";
import { hexOpacity } from "@/utils/hexOpacity";

interface HeaderProps {
    title: string;
    icon?: ReactNode | IconType;
    color?: string;
    size?: TypographySize | string | number;
    iconSize?: string | number;
}

const Header = ({
    title,
    icon,
    color = theme.colors.main.primary,
    size = theme.text.size.body,
    iconSize
}: HeaderProps) => {
    const renderIcon = () => {
        if (typeof icon === 'function') {
            const IconComponent = icon as IconType;
            return <IconComponent color={color} size={iconSize ?? size} />;
        }
        return icon;
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                {
                    icon ? (
                        <div 
                            className="p-1.5 rounded-md flex items-center justify-center"
                            style={{
                                backgroundColor : color + hexOpacity(15)
                            }}
                        >
                            {renderIcon()}
                        </div>
                    ) : null
                }
                <Text
                    size={size}
                    bold={theme.text.bold.md2}
                    textColor={color}
                >
                    {title}
                </Text>
            </div>
        </div>
    );
};

export default Header;
