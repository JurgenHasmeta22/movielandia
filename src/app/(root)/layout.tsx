import { ensureStartsWith } from "@/utils/helpers/utils";
import { AuthProvider } from "@/providers/AuthProvider";
import { ModalProvider } from "@/providers/ModalProvider";
import { RightPanelProvider } from "@/providers/RightPanelProvider";
import ToastProvider from "@/providers/ToastProvider";
import { MUIThemeProvider } from "@/providers/ThemeProvider";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import MainLayout from "@/layouts/MainLayout";
import { Montserrat } from "next/font/google";
import "../globals.css";
import ProgressLoadingProvider from "@/providers/ProgressLoadingProvider";

const montserrat = Montserrat({
    weight: ["300", "400", "500", "700"],
    subsets: ["latin"],
    display: "swap",
    fallback: ["Arial", "sans-serif"],
});

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
    ...{
        twitter: {
            card: "summary_large_image",
            creator: twitterCreator,
            site: twitterSite,
        },
    },
    viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1,
        userScalable: 'no',
        viewportFit: 'cover'
    }
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
                    <MUIThemeProvider>
                        <ToastProvider>
                            <ModalProvider>
                                <RightPanelProvider>
                                    <ProgressLoadingProvider>
                                        <InitColorSchemeScript attribute="class" />
                                        <MainLayout>{children}</MainLayout>
                                    </ProgressLoadingProvider>
                                </RightPanelProvider>
                            </ModalProvider>
                        </ToastProvider>
                    </MUIThemeProvider>
                </AuthProvider>
            </body>
        </html>
    );
}

