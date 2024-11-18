"use client";

import React from "react";
import { Box, Grid2 as Grid } from "@mui/material";
import Sidebar from "@/components/admin/sidebar/Sidebar";
import TopBar from "@/components/admin/topBar/TopBar";
import { SidebarItems } from "@/components/admin/sidebar/components/SidebarItems";
import { useStore } from "@/store/store";
import Head from "next/head";

interface IAdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: Readonly<IAdminLayoutProps>) {
    const { isOpenSidebarAdmin } = useStore();

    return (
        <>
            <Head>
                <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon/favicon-16x16.png" />
                <link rel="apple-touch-icon" sizes="180x180" href="/icons/favicon/favicon-180x180.png" />
            </Head>
            <Grid container component={"main"}>
                {isOpenSidebarAdmin && (
                    <Grid size={{ xs: 12, md: 2 }}>
                        <Sidebar sidebarItems={SidebarItems} />
                    </Grid>
                )}
                <Grid size={{ xs: 12, md: isOpenSidebarAdmin ? 10 : 12 }}>
                    <TopBar />
                    <Box
                        sx={{
                            ml: 4,
                        }}
                    >
                        {children}
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}
