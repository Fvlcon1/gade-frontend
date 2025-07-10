import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import "./styles/css/loader.css"
import { Providers } from "./providers";
import SpatialDataInitializer from './SpatialDataInitializer';
import { QueryProvider } from '@/providers/query-provider';
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from '@/components/ThemeProvider';
import { SettingsContextProvider } from '@/app/context/settings-context';

const montserrat = Montserrat({
	variable: "--font-montserrat",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "GADE",
	description: "GADE",
};

// // Initialize theme
// const savedTheme = localStorage.getItem('theme');
// if (savedTheme === 'dark') {
//   document.documentElement.classList.add('dark');
// } else {
//   // Default to light theme
//   localStorage.setItem('theme', 'light');
//   document.documentElement.classList.remove('dark');
// }

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const toaster = (
		<Toaster
			containerStyle={{
				fontFamily: "montserrat",
				zIndex: 999999,
				fontWeight: 500,
				fontSize: "12px",
			}}
		/>
	)

	return (
		<html lang="en" className="h-full">
			<body
				className={`${montserrat.variable} antialiased duration-500 h-full min-h-full`}
			>
				<QueryProvider>
					<ThemeProvider>
						<Providers>
							<SettingsContextProvider>
								<SpatialDataInitializer />
								{children}
								{toaster}
							</SettingsContextProvider>
						</Providers>
					</ThemeProvider>
				</QueryProvider>
			</body>
		</html>
	);
}
