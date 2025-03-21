import React from "react";
import { Grid2 as Grid } from "@mui/material";
import ScrollToTop from "@/components/root/scrollToTop/ScrollToTop";
import Header from "@/components/root/header/Header";
import Footer from "@/components/root/footer/Footer";
import { NuqsAdapter } from "nuqs/adapters/next/app";

interface IMainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: Readonly<IMainLayoutProps>) {
    return (
        <Grid container>
            <Grid size={{ xs: 12 }}>
                <NuqsAdapter>
                    <Header />
                    <main style={{ paddingTop: 50, paddingBottom: 22 }}>{children}</main>
                    <ScrollToTop />
                    <Footer />
                </NuqsAdapter>
            </Grid>
        </Grid>
    );
}
