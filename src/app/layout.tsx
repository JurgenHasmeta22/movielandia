import Header from "@/components/root/layout/header/Header";
import Footer from "@/components/root/layout/footer/Footer";
import { Grid } from "@mui/material";
import ScrollToTop from "@/components/root/features/scrollToTop/ScrollToTop";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import ToastProvider from "@/lib/toast/ToastProvider";
import { CustomThemeProvider } from "@/utils/theme";
import { Providers } from "./providers";
import { ensureStartsWith } from "@/utils/utils";
import { ModalProvider } from "@/providers/ModalContext";
import { RightPanelProvider } from "@/providers/RightPanelContext";
import "./globals.css";

const baseUrl = "http://localhost:4000";
const { TWITTER_CREATOR, TWITTER_SITE, SITE_NAME } = process.env;
const twitterCreator = TWITTER_CREATOR ? ensureStartsWith(TWITTER_CREATOR, "@") : undefined;
const twitterSite = TWITTER_SITE ? ensureStartsWith(TWITTER_SITE, "https://") : undefined;

export const metadata = {
    metadataBase: new URL(baseUrl),
    title: {
        default: SITE_NAME!,
        template: `%s | ${SITE_NAME}`,
    },
    robots: {
        follow: true,
        index: true,
    },
    ...(twitterCreator &&
        twitterSite && {
            twitter: {
                card: "summary_large_image",
                creator: twitterCreator,
                site: twitterSite,
            },
        }),
};

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
                                        <Grid container>
                                            <Grid item xs={12}>
                                                <Header />
                                                <main style={{ paddingTop: 50, paddingBottom: 22 }}>{children}</main>
                                                <ScrollToTop />
                                                <Footer />
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
