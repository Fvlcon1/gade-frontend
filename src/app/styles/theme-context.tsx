'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { lightColors, darkColors } from "./theme";
import { getColors } from "./theme";
import { TypographyBold, TypographySize } from "./style.types"

export type ThemeType = "light" | "dark" | "system"
interface Theme {
	colors: typeof lightColors;
	text: {
		size: {
			xs: TypographySize.xs,
			xs2: TypographySize.xs2,
			SM: TypographySize.SM,
			body: TypographySize.body,
			body2: TypographySize.body2,
			HM2: TypographySize.HM2,
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
				HM2: TypographySize.HM2,
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
		let mediaQuery: MediaQueryList | null = null;
		const handleSystemThemeChange = (e: MediaQueryListEvent) => {
			if (themeColor === "system") {
				if (e.matches) {
					document.documentElement.classList.add("dark");
					document.documentElement.classList.remove("light");
				} else {
					document.documentElement.classList.remove("dark");
					document.documentElement.classList.add("light");
				}
			}
		};

		if (themeColor === "light") {
			document.documentElement.classList.remove("dark");
			document.documentElement.classList.add("light");
		} else if (themeColor === "dark") {
			document.documentElement.classList.remove("light");
			document.documentElement.classList.add("dark");
		} else if (themeColor === "system") {
			document.documentElement.classList.remove("dark");
			document.documentElement.classList.remove("light");
			mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
			if (mediaQuery.matches) {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
			mediaQuery.addEventListener("change", handleSystemThemeChange);
		}

		localStorage.setItem("theme", themeColor);

		return () => {
			if (mediaQuery) {
				mediaQuery.removeEventListener("change", handleSystemThemeChange);
			}
		};
	}, [themeColor]);

	const getSystemTheme = () =>
	  typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
	
	const colors =
	  themeColor === "dark"
		? darkColors
		: themeColor === "light"
		? lightColors
		: getSystemTheme() === "dark"
		? darkColors
		: lightColors;
		
	const theme: Theme = {
		colors,
		text: {
			size: {
				xs: TypographySize.xs,
				xs2: TypographySize.xs2,
				SM: TypographySize.SM,
				body: TypographySize.body,
				body2: TypographySize.body2,
				HM2: TypographySize.HM2,
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
