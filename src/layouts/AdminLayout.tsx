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
