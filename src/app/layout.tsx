import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import theme from "@/utils/theme";
import Footer from "@/components/footer/Footer";
import { Grid } from "@mui/material";
import ScrollToTop from "@/components/scrollToTop/ScrollToTop";
import Header from "@/components/header/Header";
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
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <Grid container>
                            <Grid item xs={12}>
                                <Header />
                                <main style={{ paddingTop: 50, paddingBottom: 22 }}>{children}</main>
                                <ScrollToTop />
                                <Footer />
                            </Grid>
                        </Grid>
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
