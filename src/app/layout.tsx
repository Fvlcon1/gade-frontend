import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import "./styles/css/loader.css"

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
				{children}
			</body>
		</html>
	);
}
