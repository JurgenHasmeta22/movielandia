import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import Footer from "@/components/footer/Footer";
import { Grid } from "@mui/material";
import ScrollToTop from "@/components/scrollToTop/ScrollToTop";
import Header from "@/components/header/Header";
import { CustomThemeProvider } from "@/utils/theme";
import "./globals.css";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <AppRouterCacheProvider>
                    <CustomThemeProvider>
                        <Grid container>
                            <Grid item xs={12}>
                                <Header />
                                <main style={{ paddingTop: 50, paddingBottom: 22 }}>{children}</main>
                                <ScrollToTop />
                                <Footer />
                            </Grid>
                        </Grid>
                    </CustomThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
