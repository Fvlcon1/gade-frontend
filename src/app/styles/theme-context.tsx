'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { lightColors, darkColors } from "./theme";
import { getColors } from "./theme";
import { TypographyBold, TypographySize } from "./style.types"

export type ThemeType = "light" | "dark";
interface Theme {
	colors: typeof lightColors;
	text: {
		size: {
			xs: TypographySize.xs,
			xs2: TypographySize.xs2,
			SM: TypographySize.SM,
			body: TypographySize.body,
			body2: TypographySize.body2,
			HL: TypographySize.HL,
			HM: TypographySize.HM,
		},
		bold: {
			sm: TypographyBold.sm,
			sm2: TypographyBold.sm2,
			md: TypographyBold.md,
			lg: TypographyBold.lg,
			md2: TypographyBold.md2,
		},
	},
}

interface ThemeContextProps {
	colors: typeof lightColors;
	themeColor: ThemeType;
	setThemeColor: (theme: ThemeType) => void;
	theme: Theme;	
}

const ThemeContext = createContext<ThemeContextProps>({
	colors: lightColors,
	themeColor: "light",
	setThemeColor: () => { },
	theme: {
		colors: lightColors,
		text: {
			size: {
				xs: TypographySize.xs,
				xs2: TypographySize.xs2,
				SM: TypographySize.SM,
				body: TypographySize.body,
				body2: TypographySize.body2,
				HL: TypographySize.HL,
				HM: TypographySize.HM,
			},
			bold: {
				sm: TypographyBold.sm,
				sm2: TypographyBold.sm2,
				md: TypographyBold.md,
				lg: TypographyBold.lg,
				md2: TypographyBold.md2,
			},
		},
	}
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const [themeColor, setThemeColor] = useState<ThemeType>(() => {
		if (typeof window !== "undefined") {
			return (localStorage.getItem("theme") as ThemeType) || "light";
		}
		return "light";
	});

	useEffect(() => {
		localStorage.setItem("theme", themeColor);
	}, [themeColor]);

	const colors = themeColor === "dark" ? darkColors : lightColors
	const theme: Theme = {
		colors,
		text: {
			size: {
				xs: TypographySize.xs,
				xs2: TypographySize.xs2,
				SM: TypographySize.SM,
				body: TypographySize.body,
				body2: TypographySize.body2,
				HL: TypographySize.HL,
				HM: TypographySize.HM,
			},
			bold: {
				sm: TypographyBold.sm,
				sm2: TypographyBold.sm2,
				md: TypographyBold.md,
				lg: TypographyBold.lg,
				md2: TypographyBold.md2,
			},
		},
	}

	return (
		<ThemeContext.Provider
			value={{
				colors,
				themeColor,
				setThemeColor,
				theme,
			}}
		>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => useContext(ThemeContext);
