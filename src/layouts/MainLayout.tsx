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
                <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="96x96" href="/icons/favicon/favicon-96x96.png" />
                <link rel="icon" type="image/png" sizes="192x192" href="/icons/favicon/favicon-192x192.png" />
                <link rel="apple-touch-icon" sizes="57x57" href="/icons/favicon/favicon-57x57.png" />
                <link rel="apple-touch-icon" sizes="60x60" href="/icons/favicon/favicon-60x60.png" />
                <link rel="apple-touch-icon" sizes="72x72" href="/icons/favicon/favicon-72x72.png" />
                <link rel="apple-touch-icon" sizes="76x76" href="/icons/favicon/favicon-76x76.png" />
                <link rel="apple-touch-icon" sizes="114x114" href="/icons/favicon/favicon-114x114.png" />
                <link rel="apple-touch-icon" sizes="120x120" href="/icons/favicon/favicon-120x120.png" />
                <link rel="apple-touch-icon" sizes="144x144" href="/icons/favicon/favicon-144x144.png" />
                <link rel="apple-touch-icon" sizes="152x152" href="/icons/favicon/favicon-152x152.png" />
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
