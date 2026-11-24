import { AuthProvider } from "@/providers/AuthProvider";
import { ModalProvider } from "@/providers/ModalProvider";
import { RightPanelProvider } from "@/providers/RightPanelProvider";
import ToastProvider from "@/providers/ToastProvider";
import { MUIThemeProvider } from "@/providers/ThemeProvider";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import AdminLayout from "@/layouts/AdminLayout";
import { fontClassNames } from "@/utils/theme/fonts";
import "../globals.css";
import ProgressLoadingProvider from "@/providers/ProgressLoadingProvider";

export const metadata = {
	robots: {
		follow: false,
		index: false,
	},
	title: {
		default: "Admin Panel",
	},
};

export const viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: "no",
	viewportFit: "cover",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html suppressHydrationWarning lang="en">
			<body className={fontClassNames}>
				<AuthProvider>
					<MUIThemeProvider>
						<ToastProvider>
							<ModalProvider>
								<RightPanelProvider>
									<ProgressLoadingProvider>
										<InitColorSchemeScript attribute="class" />
										<AdminLayout>{children}</AdminLayout>
									</ProgressLoadingProvider>
								</RightPanelProvider>
							</ModalProvider>
						</ToastProvider>
					</MUIThemeProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
