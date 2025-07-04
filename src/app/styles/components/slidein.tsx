"use client"

import { motion, Variants } from "framer-motion";
import React, { ReactNode } from "react";

type SlideInDirection = "top" | "bottom" | "left" | "right";

interface SlideInProps {
	children: ReactNode;
	direction?: SlideInDirection;
	duration?: number;
	delay?: number;
	className?: string;
	depth?: number;
	once?: boolean;
	amount?: number | "some" | "all";
}


const SlideIn: React.FC<SlideInProps> = ({
	children,
	direction = "left",
	duration = 0.5,
	delay = 0,
	className = "",
	depth = 50,
	once = true,
	amount = 0.1,
}) => {
	const getInitialPosition = (direction: SlideInDirection) => {
		switch (direction) {
			case "top":
				return { y: -depth, x: 0 };
			case "bottom":
				return { y: depth, x: 0 };
			case "left":
				return { x: -depth, y: 0 };
			case "right":
				return { x: depth, y: 0 };
			default:
				return { x: 0, y: 0 };
		}
	};

	const variants: Variants = {
		hidden: {
			...getInitialPosition(direction),
			opacity: 0,
			transition: { duration: duration * 0.7 }
		},
		visible: {
			x: 0,
			y: 0,
			opacity: 1,
			transition: {
				type: "spring",
				stiffness: 100,
				damping: 20,
				duration,
				delay,
			},
		},
	};

	return (
		<motion.div
			initial="hidden"
			animate="visible"
			viewport={{ once, amount }}
			variants={variants}
			className={className}
		>
			{children}
		</motion.div>
	);
};

export default SlideIn;