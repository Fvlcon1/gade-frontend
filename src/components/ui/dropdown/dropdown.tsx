"use client";

import { useState, useRef, ReactNode, useLayoutEffect } from "react";
import { useClickAway } from "react-use";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { FaCheck } from "react-icons/fa";
import Text from "@styles/components/text";
import { DropdownItem } from "@/utils/@types";
import { hexOpacity } from "@/utils/hexOpacity";
import { useTheme } from "@/app/styles/theme-context";

type DropdownPosition = "bottom-right" | "bottom-left" | "top-right" | "top-left";

interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
	children?: ReactNode;
	menuItems?: DropdownItem[];
	className?: string;
	outterContainerClassName?: string;
	display?: boolean;
	component?: ReactNode;
	position?: DropdownPosition;
	onClose?: () => void;
	value?: any;
	onChange?: (value: any) => void;
}

const Dropdown = ({
	children,
	menuItems,
	className,
	outterContainerClassName,
	display,
	component,
	onClick,
	position,
	onClose,
	value,
	onChange,
	...rest
}: DropdownProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [autoPosition, setAutoPosition] = useState<DropdownPosition>("bottom-right");
	const menuRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLDivElement>(null);
	const { theme } = useTheme()

	// Close when clicking outside
	useClickAway(menuRef, () => {
		handleClose();
	});

	const handleClose = () => {
		if (display === undefined) setIsOpen(false);
		onClose?.();
	}

	// Auto-position logic
	useLayoutEffect(() => {
		if (!(display ?? isOpen) || position) return;
		const menu = menuRef.current;
		const trigger = triggerRef.current;
		if (!menu || !trigger) return;

		const menuRect = menu.getBoundingClientRect();
		const triggerRect = trigger.getBoundingClientRect();
		const vw = window.innerWidth;
		const vh = window.innerHeight;

		let best: DropdownPosition = "bottom-right";
		// Try bottom-right
		if (
			triggerRect.bottom + menuRect.height <= vh &&
			triggerRect.right + menuRect.width <= vw
		) {
			best = "bottom-right";
		} else if (
			triggerRect.bottom + menuRect.height <= vh &&
			triggerRect.left - menuRect.width >= 0
		) {
			best = "bottom-left";
		} else if (
			triggerRect.top - menuRect.height >= 0 &&
			triggerRect.right + menuRect.width <= vw
		) {
			best = "top-right";
		} else if (
			triggerRect.top - menuRect.height >= 0 &&
			triggerRect.left - menuRect.width >= 0
		) {
			best = "top-left";
		}
		setAutoPosition(best);
	}, [display, isOpen, position]);

	// Map position to className
	const getMenuPositionClass = () => {
		const pos = position || autoPosition;
		switch (pos) {
			case "bottom-right":
				return "right-0 mt-2 top-full";
			case "bottom-left":
				return "left-0 mt-2 top-full";
			case "top-right":
				return "right-0 mb-2 bottom-full";
			case "top-left":
				return "left-0 mb-2 bottom-full";
			default:
				return "right-0 mt-2 top-full";
		}
	};

	return (
		<div
			{...rest}
			className={`relative inline-block ${outterContainerClassName ?? ""}`}
			ref={menuRef}
		>
			{/* Toggle button */}
			<div
				ref={triggerRef}
				onClick={(e) => {
					if (display === undefined) isOpen ? handleClose() : setIsOpen((prev) => !prev)
					onClick?.(e);
				}}
			>
				{children}
			</div>

			{/* Dropdown Menu */}
			<AnimatePresence>
				{(display ?? isOpen) && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className={`absolute overflow-y-auto min-w-[150px] max-h-[300px] w-full bg-bg-primary border border-border-primary rounded-lg shadow-lg shadow-[#4d4ddc11] z-50 py-1 pt-[6px] ${getMenuPositionClass()} ${className ?? ""}`}
					>
						{/* items */}
						{menuItems && (
							<div className="flex flex-col gap-0.5">
								{menuItems.map((item) =>
									item.type === "divider" ? (
										<div key={item.key} className="border-t border-border-primary my-1" />
									) : item.type === "loading" ? (
										<div key={item.key} className="pl-2 h-5 overflow-hidden">
											<div className="normal-loader !w-5" />
										</div>
									) : (
										<div
											key={item.key}
											className={`${item.type === "title" ? "px-3" : "px-1"} gap-2 ${item.disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
												}`}
											onClick={() => {
												if (!item.disabled && display === undefined) handleClose();
												if (item.value) onChange?.(item.value);
												item.onClick?.();
											}}
										>
											{item.type === "link" ? (
												<Link href={item.href ?? "#"}>
													<DropdownRow item={item} />
												</Link>
											) : (
												<DropdownRow item={item} />
											)}
										</div>
									)
								)}
							</div>
						)}
						{component}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

const DropdownRow = ({ item }: { item: DropdownItem }) => {
	const { theme } = useTheme()
	return (
		<div
			className={`${!item.disabled ? "hover:bg-bg-secondary px-2 py-[6px] rounded-md flex gap-[6px] items-center" : "flex"
				} ${item.isSelected ? "bg-main-primary/10" : ""}`}
		>
			{item.isSelected && <FaCheck color={theme.colors.main.primary} size={12} />}
			{item.icon && <span>{item.icon}</span>}
			{typeof item.label === "string" ? (
				<Text
					ellipsis
					textColor={item.isSelected ? theme.colors.main.primary : theme.colors.text.secondary}
				>
					{item.label}
				</Text>
			) : (
				item.label
			)}
		</div>
	)
};

export default Dropdown;
