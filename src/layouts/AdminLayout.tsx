import React from "react";
import { Box, Grid } from "@mui/material";
import Sidebar from "@/components/admin/layout/sidebar/Sidebar";
import TopBar from "@/components/admin/layout/topBar/TopBar";
import { SidebarItems } from "@/utils/componentHelpers/SidebarItems";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Grid container component={"main"}>
            <Grid item xs={12} md={2}>
                <Sidebar sidebarItems={SidebarItems} />
            </Grid>
            <Grid item xs={12} md={10}>
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
