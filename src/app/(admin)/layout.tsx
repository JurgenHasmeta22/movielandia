import { Box, Grid } from "@mui/material";
import Sidebar from "@/components/admin/layout/sidebar/Sidebar";
import TopBar from "@/components/admin/layout/topBar/TopBar";
import { SidebarItems } from "@/utils/componentHelpers/SidebarItems";
import { AuthProvider } from "@/providers/AuthProvider";
import { ModalProvider } from "@/providers/ModalProvider";
import { RightPanelProvider } from "@/providers/RightPanelProvider";
import ToastProvider from "@/providers/ToastProvider";
import { CustomThemeProvider } from "@/utils/theme/theme";

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
                    <CustomThemeProvider>
                        <ToastProvider>
                            <ModalProvider>
                                <RightPanelProvider>
                                    <Grid container component={"main"}>
                                        <Grid item xs={12} md={2}>
                                            <Sidebar sidebarItems={SidebarItems} />
                                        </Grid>
                                        <Grid item xs={12} md={10}>
                                            <TopBar />
                                            <Box ml={4}>{children}</Box>
                                        </Grid>
                                    </Grid>
                                </RightPanelProvider>
                            </ModalProvider>
                        </ToastProvider>
                    </CustomThemeProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
