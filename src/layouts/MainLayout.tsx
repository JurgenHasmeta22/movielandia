import React from "react";
import { Grid2 as Grid } from "@mui/material";
import ScrollToTop from "@/components/root/scrollToTop/ScrollToTop";
import Header from "@/components/root/header/Header";
import Footer from "@/components/root/footer/Footer";
import Head from "next/head";

interface IMainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: Readonly<IMainLayoutProps>) {
    return (
        <>
            <Head>
                <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon/favicon-16x16.png" />
                <link rel="apple-touch-icon" sizes="180x180" href="/icons/favicon/favicon-180x180.png" />
            </Head>
            <Grid container>
                <Grid size={{ xs: 12 }}>
                    <Header />
                    <main style={{ paddingTop: 50, paddingBottom: 22 }}>{children}</main>
                    <ScrollToTop />
                    <Footer />
                </Grid>
            </Grid>
        </>
    );
}
