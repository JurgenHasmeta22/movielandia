"use client";

import React from "react";
import { Box, Grid2 as Grid } from "@mui/material";
import Sidebar from "@/components/admin/sidebar/Sidebar";
import TopBar from "@/components/admin/topBar/TopBar";
import { SidebarItems } from "@/components/admin/sidebar/components/SidebarItems";
import { useStore } from "@/store/store";

interface IAdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: Readonly<IAdminLayoutProps>) {
    const { isOpenSidebarAdmin } = useStore();

    return (
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
    );
}
