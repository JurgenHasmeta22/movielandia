import React from "react";
import { Grid2 as Grid } from "@mui/material";
import ScrollToTop from "@/components/root/ui/scrollToTop/ScrollToTop";
import Header from "@/components/root/ui/header/Header";
import Footer from "@/components/root/ui/footer/Footer";

interface IMainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: Readonly<IMainLayoutProps>) {
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
