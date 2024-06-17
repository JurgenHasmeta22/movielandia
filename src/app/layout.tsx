import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { Grid } from "@mui/material";
import ScrollToTop from "@/components/scrollToTop/ScrollToTop";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import ToastProvider from "@/lib/toastify/ToastProvider";
import { CustomThemeProvider } from "@/utils/theme";
import { Providers } from "./providers";
import "./globals.css";
import { ensureStartsWith } from "@/utils/utils";

const { TWITTER_CREATOR, TWITTER_SITE, SITE_NAME } = process.env;
// const baseUrl = process.env.NEXT_PUBLIC_PROJECT_URL
//     ? `https://${process.env.NEXT_PUBLIC_PROJECT_URL}`
//     : "http://localhost:4000";
const baseUrl = "http://localhost:4000";
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
    // const setInitialTheme = `
    //     (function() {
    //         const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    //         if (theme === 'dark') {
    //             document.documentElement.classList.add('dark');
    //         } else {
    //             document.documentElement.classList.remove('dark');
    //         }
    //     })();
    // `;

    return (
        <html lang="en">
            {/* <head>
                <script dangerouslySetInnerHTML={{ __html: setInitialTheme }} />
            </head> */}
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
