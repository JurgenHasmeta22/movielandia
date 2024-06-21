import { Grid } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import ToastProvider from "@/lib/toast/ToastProvider";
import { CustomThemeProvider } from "@/utils/theme";
import { ModalProvider } from "@/providers/ModalContext";
import { RightPanelProvider } from "@/providers/RightPanelContext";
import { Providers } from "../providers";
import Sidebar from "@/components/admin/layout/sidebar/Sidebar";
import TopBar from "@/components/admin/layout/topBar/TopBar";
import { sidebarItems } from "@/utils/sidebarItems";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    <AppRouterCacheProvider>
                        <CustomThemeProvider>
                            <ToastProvider>
                                <ModalProvider>
                                    <RightPanelProvider>
                                        <Grid container component={"main"}>
                                            <Grid item xs={12} md={2}>
                                                <Sidebar sidebarItems={sidebarItems} />
                                            </Grid>
                                            <Grid item xs={12} md={10}>
                                                <TopBar />
                                                <main style={{ marginLeft: 3 }}>{children}</main>
                                            </Grid>
                                        </Grid>
                                    </RightPanelProvider>
                                </ModalProvider>
                            </ToastProvider>
                        </CustomThemeProvider>
                    </AppRouterCacheProvider>
                </Providers>
            </body>
        </html>
    );
}
