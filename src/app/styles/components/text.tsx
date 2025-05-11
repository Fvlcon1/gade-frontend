'use client'
import { AppTypographyProps, TypographyBold, TypographySize } from "@styles/style.types"
import theme from "@styles/theme"
import { Montserrat } from "next/font/google"
import { useState } from "react"

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400", "600", "700"], // Add required font weights
    variable: "--font-montserrat",
});

const Text = ({
    children,
    className = "",
    bold,
    size,
    textColor,
    wrap,
    underline,
    clickable,
    clickableLink,
    italic,
    textAlign,
    display,
    ellipsis,
    fontfamily,
    maxLines,
    lineHeight,
    whiteSpace,
    onClick
} : AppTypographyProps) => {

    const [onHover, setOnHover] = useState<boolean>(false)

    return (
        <span
            className={`
                ${className} 
                w-fit 
                ${
                    fontfamily === 'montserrat' 
                    ? montserrat.variable 
                    : fontfamily === 'greater-theory'
                    ? 'greater-theory'
                    : montserrat.style.fontFamily
                }
            `}
            style={{
                fontFamily: fontfamily === 'montserrat' ? montserrat.style.fontFamily : fontfamily === 'greater-theory' ? 'greater-theory' : montserrat.style.fontFamily,
                fontWeight : bold ?? TypographyBold.sm2,
                fontSize : size ?? TypographySize.body,
                color : onHover && clickableLink 
                        ? textColor
                        : textColor
                        ?? theme.colors.text.secondary,
                flexWrap : wrap ? 'wrap' : 'nowrap',
                textDecoration : underline || (onHover && clickableLink) ? 'underline' : 'none',
                opacity : onHover && (clickable || clickableLink) ? 0.7 : 1,
                fontStyle : italic ? 'italic' : 'normal',
                textAlign,
                display: display ?? maxLines ? '-webkit-box' : 'inline-block',
                WebkitLineClamp : maxLines ?? 6,
                WebkitBoxOrient : 'vertical',
                textOverflow : ellipsis ? 'ellipsis' : 'none',
                cursor : (clickableLink || clickable) ? 'pointer' : '',
                whiteSpace : maxLines ? 'none' : ellipsis ? 'nowrap' : 'none',
                overflow : ellipsis ? 'hidden' : 'inherit'
            }}
            onMouseOver={()=>setOnHover(true)}
            onMouseLeave={()=>setOnHover(false)}
            onClick={onClick}
        >
            {children}
        </span>
    )
}

export const Head1 = (props : AppTypographyProps) => {
    return (
        <Text
            size={TypographySize.HL}
            textColor={theme.colors.text.secondary}
            lineHeight={1.3}
            {...props}
        >
            {props.children}
        </Text>
    )
}

export default Text