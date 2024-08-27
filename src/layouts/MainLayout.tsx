import React from "react";
import Header from "@/components/root/layout/header/Header";
import Footer from "@/components/root/layout/footer/Footer";
import { Grid2 as Grid } from "@mui/material";
import ScrollToTop from "@/components/root/features/scrollToTop/ScrollToTop";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Grid container>
            <Grid size={{ xs: 12 }}>
                <Header />
                <main style={{ paddingTop: 50, paddingBottom: 22 }}>{children}</main>
                <ScrollToTop />
                <Footer />
            </Grid>
        </Grid>
    );
}
