import { AuthProvider } from "@/providers/AuthProvider";
import { ModalProvider } from "@/providers/ModalProvider";
import { RightPanelProvider } from "@/providers/RightPanelProvider";
import ToastProvider from "@/providers/ToastProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import AdminLayout from "@/layouts/AdminLayout";
import { Montserrat } from "next/font/google";
import "../globals.css";

const montserrat = Montserrat({
    weight: ["300", "400", "500", "700"],
    subsets: ["latin"],
    display: "swap",
    fallback: ["Arial", "sans-serif"],
});

export const metadata = {
    // robots: {
    //     follow: false,
    //     index: false,
    // },
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
            <body className={montserrat.className}>
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
