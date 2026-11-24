"use client";

import React, { useEffect } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Sidebar from "@/components/admin/sidebar/Sidebar";
import TopBar from "@/components/admin/topBar/TopBar";
import { SidebarItems } from "@/components/admin/sidebar/components/SidebarItems";
import { ADMIN_SIDEBAR_WIDTH } from "@/components/admin/sidebar/constants";
import { useStore } from "@/store/store";
import { NuqsAdapter } from "nuqs/adapters/next/app";

interface IAdminLayoutProps {
	children: React.ReactNode;
}

export default function AdminLayout({ children }: Readonly<IAdminLayoutProps>) {
	const { isOpenSidebarAdmin, setIsOpenSidebarAdmin } = useStore();
	const theme = useTheme();
	const isDesktop = useMediaQuery(theme.breakpoints.up("md"), {
		noSsr: true,
	});

	useEffect(() => {
		if (!isDesktop) {
			setIsOpenSidebarAdmin(false);
		}
	}, []);

	return (
		<Box sx={{ minHeight: "100vh" }}>
			<Sidebar sidebarItems={SidebarItems} />
			<Box
				component="main"
				sx={{
					minWidth: 0,
					ml: { xs: 0, md: isOpenSidebarAdmin ? `${ADMIN_SIDEBAR_WIDTH}px` : 0 },
					transition: theme.transitions.create("margin", {
						easing: theme.transitions.easing.easeOut,
						duration: theme.transitions.duration.enteringScreen,
					}),
				}}
			>
				<TopBar />
				<Box
					sx={{
						px: { xs: 0, sm: 1, md: 2 },
						py: 2,
						maxWidth: 1800,
						mx: "auto",
					}}
				>
					<NuqsAdapter>{children}</NuqsAdapter>
				</Box>
			</Box>
		</Box>
	);
}
