"use client";

import { JSX, useEffect } from "react";
import {
	Avatar,
	Box,
	Divider,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useStore } from "@/store/store";
import { SidebarItem } from "./components/SidebarItem";
import { ADMIN_SIDEBAR_WIDTH } from "./constants";
import MuiNextLink from "@/components/root/muiNextLink/MuiNextLink";
import type {} from "@mui/material/themeCssVarsAugmentation";

interface ISidebarItem {
	label: string;
	to: string;
	icon: JSX.Element;
	index: number;
}

interface ISidebarProps {
	sidebarItems: ISidebarItem[];
}

const Sidebar = ({ sidebarItems }: ISidebarProps) => {
	const { data: session } = useSession();
	const { isOpenSidebarAdmin, setIsOpenSidebarAdmin } = useStore();
	const router = useRouter();
	const pathname = usePathname();
	const theme = useTheme();
	const isDesktop = useMediaQuery(theme.breakpoints.up("md"), {
		noSsr: true,
	});

	useEffect(() => {
		if (!isDesktop) {
			setIsOpenSidebarAdmin(false);
		}
	}, [pathname]);

	const handleItemClick = (to: string) => {
		router.push(to);

		if (!isDesktop) {
			setIsOpenSidebarAdmin(false);
		}
	};

	const onClose = () => {
		setIsOpenSidebarAdmin(false);
	};

	async function onLogout() {
		await signOut();
		router.push("/login");
	}

	const content = (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				height: "100%",
				px: 1.5,
				py: 1.5,
			}}
		>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					px: 0.5,
				}}
			>
				<IconButton
					LinkComponent={MuiNextLink}
					href="/admin"
					aria-label="MovieLandia24 Admin"
					sx={{
						p: 0,
						borderRadius: 2,
						"&:hover": { backgroundColor: "transparent" },
					}}
				>
					<Image
						src="/icons/movielandia24-logo.png"
						alt="MovieLandia24 Admin"
						height={48}
						width={150}
						priority
						style={{ objectFit: "contain" }}
					/>
				</IconButton>
				<IconButton onClick={onClose} aria-label="Close sidebar">
					<CloseIcon color="action" />
				</IconButton>
			</Box>

			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					gap: 1.5,
					mt: 2,
					mb: 2,
					p: 1.5,
					borderRadius: "14px",
					border: `1px solid ${theme.vars.palette.divider}`,
					backgroundColor: `rgba(${theme.vars.palette.accent.mainChannel} / 0.08)`,
				}}
			>
				<Avatar
					sx={{
						width: 36,
						height: 36,
						bgcolor: theme.vars.palette.accent.main,
						color: theme.vars.palette.accent.contrastText,
						fontWeight: 700,
					}}
				>
					{session?.user?.userName?.charAt(0).toUpperCase()}
				</Avatar>
				<Typography
					variant="body2"
					noWrap
					sx={{ fontWeight: 600, color: "text.primary" }}
				>
					{session?.user && `@${session?.user?.userName}`}
				</Typography>
			</Box>

			<Divider sx={{ mb: 1.5 }} />

			<List
				disablePadding
				sx={{ flex: 1, overflowY: "auto", mx: -1.5, px: 1.5 }}
			>
				{sidebarItems?.map((item) => (
					<SidebarItem
						key={item.label}
						item={item}
						selected={pathname.startsWith(item.to)}
						handleItemClick={handleItemClick}
					/>
				))}
			</List>

			<Divider sx={{ my: 1.5 }} />

			<ListItem disablePadding>
				<ListItemButton
					onClick={onLogout}
					sx={{
						color: "text.secondary",
						"&:hover": {
							color: theme.vars.palette.red.main,
							backgroundColor: `rgba(${theme.vars.palette.red.mainChannel} / 0.1)`,
						},
					}}
				>
					<ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
						<LogoutIcon />
					</ListItemIcon>
					<ListItemText
						primary="Logout"
						slotProps={{ primary: { sx: { fontWeight: 600 } } }}
					/>
				</ListItemButton>
			</ListItem>
		</Box>
	);

	const paperSx = {
		width: ADMIN_SIDEBAR_WIDTH,
		boxSizing: "border-box",
		backgroundColor: theme.vars.palette.background.paper,
	};

	return (
		<>
			<Drawer
				variant="persistent"
				anchor="left"
				open={isOpenSidebarAdmin}
				component="aside"
				sx={{
					display: { xs: "none", md: "block" },
					"& .MuiDrawer-paper": paperSx,
				}}
			>
				{content}
			</Drawer>
			<Drawer
				variant="temporary"
				anchor="left"
				open={isOpenSidebarAdmin && !isDesktop}
				onClose={onClose}
				component="aside"
				sx={{
					display: { xs: "block", md: "none" },
					"& .MuiDrawer-paper": { ...paperSx, maxWidth: "85vw" },
				}}
			>
				{content}
			</Drawer>
		</>
	);
};

export default Sidebar;
