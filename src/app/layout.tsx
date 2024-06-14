import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import type { Metadata } from "next";
import theme from "@/utils/theme";
import "./globals.css";
import Footer from "@/components/footer/Footer";
import { Grid } from "@mui/material";
import ScrollToTop from "@/components/scrollToTop/ScrollToTop";
import Header from "@/components/header/Header";

export const metadata: Metadata = {
    title: "MovieLand24 - Your Ultimate Destination for Movies",
    description:
        "Welcome to MovieLand24 - your ultimate destination for movies. Discover a vast collection of movies and enjoy streaming your favorites.",
};

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
