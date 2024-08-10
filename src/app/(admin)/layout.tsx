import { AuthProvider } from "@/providers/AuthProvider";
import { ModalProvider } from "@/providers/ModalProvider";
import { RightPanelProvider } from "@/providers/RightPanelProvider";
import ToastProvider from "@/providers/ToastProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import AdminLayout from "@/layouts/AdminLayout";
import "../globals.css";

export const metadata = {
    robots: {
        follow: false,
        index: false,
    },
    title: {
        default: "Admin Panel",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html suppressHydrationWarning lang="en">
            <body>
                <AuthProvider>
                    <InitColorSchemeScript defaultMode="dark" />
                    <ThemeProvider>
                        <ToastProvider>
                            <ModalProvider>
                                <RightPanelProvider>
                                    <InitColorSchemeScript defaultMode="dark" />
                                    <AdminLayout>{children}</AdminLayout>
                                </RightPanelProvider>
                            </ModalProvider>
                        </ToastProvider>
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
