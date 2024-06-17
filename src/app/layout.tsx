import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { Grid } from "@mui/material";
import ScrollToTop from "@/components/scrollToTop/ScrollToTop";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import ToastProvider from "@/lib/toastify/ToastProvider";
import { CustomThemeProvider } from "@/utils/theme";
import { Providers } from "./providers";
import "./globals.css";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const setInitialTheme = `
        (function() {
            const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        })();
    `;

    return (
        <html lang="en">
            <head>
                <script dangerouslySetInnerHTML={{ __html: setInitialTheme }} />
            </head>
            <body>
                <Providers>
                    <AppRouterCacheProvider>
                        <CustomThemeProvider>
                            <ToastProvider>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <Header />
                                        <main style={{ paddingTop: 50, paddingBottom: 22 }}>{children}</main>
                                        <ScrollToTop />
                                        <Footer />
                                    </Grid>
                                </Grid>
                            </ToastProvider>
                        </CustomThemeProvider>
                    </AppRouterCacheProvider>
                </Providers>
            </body>
        </html>
    );
}
