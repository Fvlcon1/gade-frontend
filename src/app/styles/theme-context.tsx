'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo } from "react";
import { lightColors, darkColors } from './theme';
import { getColors } from "./theme";
import { TypographyBold, TypographySize } from "./style.types"
import { useSettingsContext } from "../context/settings-context";

export type ThemeType = "light" | "dark" | "system"
interface Theme {
	colors: typeof lightColors;
	darkColors: typeof darkColors;
	lightColors: typeof lightColors;
	darkColor: string;
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
	systemTheme: ThemeType;
	theme: Theme;
}

const ThemeContext = createContext<ThemeContextProps>({
	colors: lightColors,
	themeColor: "light",
	systemTheme: "light",
	theme: {
		darkColors,
		lightColors,
		colors: lightColors,
		darkColor: "",
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
	const {settings} = useSettingsContext()

	const [systemTheme, setSystemTheme] = useState<ThemeType>(() => {
		if (typeof window !== "undefined") {
			return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
		}
		return "light";
	});

	const [themeColor, setThemeColor] = useState<ThemeType>(() => {
		if (typeof window !== "undefined") {
			return (localStorage.getItem("theme") as ThemeType) || "light";
		}
		return "light";
	});

	useEffect(() => {
		const appTheme = settings?.appTheme

		let mediaQuery: MediaQueryList | null = null;
		const handleSystemThemeChange = (e: MediaQueryListEvent) => {
			if (appTheme === "system") {
				if (e.matches) {
					document.documentElement.classList.add("dark");
					document.documentElement.classList.remove("light");
					setThemeColor("dark")
				} else {
					document.documentElement.classList.remove("dark");
					document.documentElement.classList.add("light");
					setThemeColor("light")
				}
			}
		};

		if (appTheme === "light") {
			document.documentElement.classList.remove("dark");
			document.documentElement.classList.add("light");
			setThemeColor("light")
		} else if (appTheme === "dark") {
			document.documentElement.classList.remove("light");
			document.documentElement.classList.add("dark");
			setThemeColor("dark")
		} else if (appTheme === "system") {
			document.documentElement.classList.remove("dark");
			document.documentElement.classList.remove("light");
			mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
			if (mediaQuery.matches) {
				document.documentElement.classList.add("dark");
				setThemeColor("dark")
			} else {
				document.documentElement.classList.remove("dark");
				setThemeColor("light")
			}
			mediaQuery.addEventListener("change", handleSystemThemeChange);
		}

		localStorage.setItem("theme", appTheme);

		return () => {
			if (mediaQuery) {
				mediaQuery.removeEventListener("change", handleSystemThemeChange);
			}
		};
	}, [settings]);

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

	const darkColor = useMemo(() => {
		if (themeColor === "system") {
			if (systemTheme === "dark") {
				return colors.text.secondary
			}
		} else if (themeColor === "dark") {
			return colors.text.secondary
		}
		return colors.main.primary
	}, [themeColor, systemTheme]);

	const theme: Theme = {
		colors,
		darkColors,
		lightColors,
		darkColor,
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
				systemTheme,
				theme,
			}}
		>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => useContext(ThemeContext);
