'use client'
import theme from "@styles/theme";
import { ButtonProps } from "@/utils/@types";
import Text from "@styles/components/text";
import { useState } from "react";
import { TypographyBold } from "@styles/style.types";
import { ImSpinner10 } from "react-icons/im";

const Button = ({
	className,
	id,
	color,
	background,
	border,
	type,
	onClick,
	radius,
	maxWidth,
	size,
	textSize,
	textBold,
	padding,
	loading,
	disabled,
	hover,
	text,
	icon,
	loadingColor
}: ButtonProps) => {

	const [onHover, setOnHover] = useState<boolean>(false)
	const [onPress, setOnPress] = useState<boolean>(false)

	const getBackground = () => {
		return (onHover && !disabled)
			? hover?.background
			?? background
			?? theme.colors.main.primary
			: background
			?? theme.colors.main.primary
	}

	const getOpacity = () => {
		return (onHover && !disabled)
			? hover?.opacity
			?? 0.8
			: disabled
				? 0.5 : 1
	}

	const getTextColor = () => {
		return onHover ? hover?.color
			? hover.color
			: color ?? theme.colors.bg.primary
			: color ?? theme.colors.bg.primary
	}

	const getButtonStyle = () => {
		return {
			background: getBackground(),
			padding: padding ?? '7px 15px',
			border: border,
			borderRadius: radius ? `${radius}px` : '7px',
			maxWidth,
			width: size?.width ?? 'fit-content',
			height: size?.height ?? '35px',
			opacity: getOpacity(),
			transform: `scale(${onPress ? 0.97 : 1})`
		}
	}

	const loader = (
		<ImSpinner10 className="animate-spin" color={loadingColor ?? "white"} size={15} />
	)
	
	const buttonText = (
		<div 
			className="flex w-fit gap-[6px] items-center"
			style={{
				color: getTextColor()
			}}
		>
			{loading ? loader : icon}
			<Text
				size={textSize}
				bold={textBold ?? TypographyBold.md}
				textColor={getTextColor()}
				maxLines={1}
				ellipsis
				whiteSpace="nowrap"
			>
				{text ?? 'Button'}
			</Text>
		</div>
	)

	return (
		<button
			style={getButtonStyle()}
			onClick={onClick}
			onMouseOver={() => setOnHover(true)}
			onMouseLeave={() => setOnHover(false)}
			onMouseDown={() => setOnPress(true)}
			onMouseUp={() => setOnPress(false)}
			className={`${className} duration-200 ${disabled && 'cursor-not-allowed'} ${loading && 'cursor-wait'} cursor-pointer`}
			disabled={disabled ?? loading}
			type={type ?? 'submit'}
			id={id}
		>
			<div className="w-full justify-center items-center flex gap-[8px]">
				{buttonText}
			</div>
		</button>
	)
}

type customPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export default Button