import Header from "@/components/root/layout/header/Header";
import Footer from "@/components/root/layout/footer/Footer";
import { Grid } from "@mui/material";
import ScrollToTop from "@/components/root/features/scrollToTop/ScrollToTop";
import { ensureStartsWith } from "@/utils/helpers/utils";
import { AuthProvider } from "@/providers/AuthProvider";
import { ModalProvider } from "@/providers/ModalProvider";
import { RightPanelProvider } from "@/providers/RightPanelProvider";
import ToastProvider from "@/providers/ToastProvider";
import { CustomThemeProvider } from "@/utils/theme/theme";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import "../globals.css";

const baseUrl = process.env.NEXT_PUBLIC_PROJECT_URL!;
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
        <html suppressHydrationWarning lang="en">
            <body>
                <AuthProvider>
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
                </AuthProvider>
            </body>
        </html>
    );
}
