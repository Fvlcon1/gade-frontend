'use client'
import { MouseEvent, ReactNode, useState } from "react";

const Pressable = ({
	children,
	onClick,
	className,
	scaleFactor
}: {
	children: ReactNode
	onClick?: (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void
	className?: string,
	scaleFactor?: number
}) => {

	const [onHover, setOnHover] = useState<boolean>(false)
	const [onPress, setOnPress] = useState<boolean>(false)

	return (
		<div
			onClick={onClick ? (e) => onClick(e) : () => { }}
			onMouseOver={() => setOnHover(true)}
			onMouseLeave={() => setOnHover(false)}
			onMouseDown={() => setOnPress(true)}
			onMouseUp={() => setOnPress(false)}
			className={`${className} duration-200 cursor-pointer`}
			style={{
				transform: `scale(${onPress ? scaleFactor ?? 0.97 : 1})`,
			}}
		>
			{children}
		</div>
	)
}
export default Pressable