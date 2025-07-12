import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import "./styles/css/loader.css"
import { Providers } from "./providers";
import { ConfirmationModalProvider } from "@/components/ui/confirmation-modal/confirmation-modal-context";
import SpatialDataInitializer from './SpatialDataInitializer';
import { QueryProvider } from '@/providers/query-provider';
import { Toaster } from "react-hot-toast";
import { SettingsContextProvider } from '@/app/context/settings-context';
import { ThemeProvider } from "@styles/theme-context";

const montserrat = Montserrat({
	variable: "--font-montserrat",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "GADE",
	description: "GADE",
};

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
								<ConfirmationModalProvider>
									<SpatialDataInitializer />
									{children}
									{toaster}
								</ConfirmationModalProvider>
							</SettingsContextProvider>
						</Providers>
					</ThemeProvider>
				</QueryProvider>
			</body>
		</html>
	);
}
