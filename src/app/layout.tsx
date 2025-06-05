import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import "./styles/css/loader.css"
import { Providers } from "./providers";
import SpatialDataInitializer from './SpatialDataInitializer';

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
	return (
		<html lang="en">
			<body
				className={`${montserrat.variable} antialiased`}
			>
				<Providers>
					<SpatialDataInitializer />
				{children}
				</Providers>
			</body>
		</html>
	);
}
