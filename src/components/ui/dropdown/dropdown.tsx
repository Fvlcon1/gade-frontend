"use client";

import { useState, useRef, ReactNode } from "react";
import { useClickAway } from "react-use";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { FaCheck } from "react-icons/fa";
import { IconType } from "react-icons";

import Text from "@styles/components/text";
import theme from "@styles/theme";
import { DropdownItem } from "@/utils/@types";
import { hexOpacity } from "@/utils/hexOpacity";

// ────────────────────────────────────────────
// Types
// ────────────────────────────────────────────
interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
	children?: ReactNode;
	menuItems?: DropdownItem[];
	className?: string;
	outterContainerClassName?: string;
	display?: boolean;
	component?: ReactNode;
}

const Dropdown = ({
	children,
	menuItems,
	className,
	outterContainerClassName,
	display,
	component,
	onClick,
	...rest
}: DropdownProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	// Close when clicking outside
	useClickAway(menuRef, () => {
		if (display === undefined) setIsOpen(false);
	});

	return (
		<div
			{...rest}
			className={`relative inline-block ${outterContainerClassName ?? ""}`}
			ref={menuRef}
		>
			{/* Toggle button */}
			<div
				onClick={(e) => {
					if (display === undefined) setIsOpen((prev) => !prev);
					onClick?.(e); // keep parent handler if provided
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
						className={`absolute overflow-y-auto right-0 mt-2 min-w-[150px] max-h-[300px] w-full bg-bg-primary border border-border-primary rounded-lg shadow-lg shadow-[#4d4ddc11] z-50 py-1 pt-[6px] ${className ?? ""}`}
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
												if (!item.disabled && display === undefined) setIsOpen(false);
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

// ────────────────────────────────────────────
// Helper: renders one row (to reduce duplication)
// ────────────────────────────────────────────
const DropdownRow = ({ item }: { item: DropdownItem }) => (
	<div
		className={`${!item.disabled ? "hover:bg-bg-secondary px-2 py-[3px] rounded-md flex gap-[6px] items-center" : "flex"
			} ${item.isSelected ? "bg-main-primary/10" : ""}`}
	>
		{item.isSelected && <FaCheck color={theme.colors.main.primary} size={12} />}
		{item.icon && <span>{item.icon}</span>}
		{typeof item.label === "string" ? (
			<Text ellipsis textColor={item.isSelected ? theme.colors.main.primary : theme.colors.text.secondary}>
				{item.label}
			</Text>
		) : (
			item.label
		)}
	</div>
);

export default Dropdown;
