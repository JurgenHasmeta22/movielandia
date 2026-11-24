"use client";

import {
	AppBar,
	Avatar,
	Box,
	IconButton,
	Menu,
	MenuItem,
	Toolbar,
	Typography,
	useTheme,
} from "@mui/material";
import { useState } from "react";
import { useStore } from "@/store/store";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import type {} from "@mui/material/themeCssVarsAugmentation";
import SwitchThemeButton from "@/components/root/themeToggleButton/ThemeToggleButton";
import Image from "next/image";
import MuiNextLink from "@/components/root/muiNextLink/MuiNextLink";

const TopBar = () => {
	const { data: session } = useSession();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const { isOpenSidebarAdmin, setIsOpenSidebarAdmin } = useStore();
	const router = useRouter();
	const theme = useTheme();
	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = async () => {
		await signOut();
		handleClose();
		router.push("/login");
	};

	const handleRedirectToProfile = () => {
		if (session?.user?.role === "Admin") {
			router.push("/admin");
		} else {
			router.push("/users/1/admin");
		}

		handleClose();
	};

	const handleGoToHome = () => {
		router.push("/");
		handleClose();
	};

	return (
		<AppBar
			position="sticky"
			component={"header"}
			sx={{
				top: 0,
				backgroundColor: `rgba(${theme.vars.palette.background.defaultChannel} / 0.72)`,
				backdropFilter: "blur(18px) saturate(1.4)",
				WebkitBackdropFilter: "blur(18px) saturate(1.4)",
				borderBottom: `1px solid ${theme.vars.palette.divider}`,
			}}
		>
			<Toolbar
				sx={{
					display: "flex",
					justifyContent: "space-between",
					minHeight: { xs: 60, sm: 68 },
					px: { xs: 1.5, sm: 3 },
				}}
				component={"nav"}
			>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						gap: 1.5,
					}}
				>
					<IconButton
						aria-label="Open sidebar"
						onClick={() => {
							setIsOpenSidebarAdmin(true);
						}}
						sx={{
							display: {
								xs: "inline-flex",
								md: isOpenSidebarAdmin ? "none" : "inline-flex",
							},
						}}
					>
						<MenuIcon fontSize="medium" />
					</IconButton>
					<IconButton
						LinkComponent={MuiNextLink}
						href={"/admin"}
						aria-label="MovieLandia24 Admin"
						sx={{
							display: {
								xs: "inline-flex",
								md: isOpenSidebarAdmin ? "none" : "inline-flex",
							},
							padding: 0,
							minWidth: "auto",
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
				</Box>
				<Box
					sx={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						gap: 0.5,
					}}
				>
					<SwitchThemeButton />
					<IconButton
						id="buttonProfile"
						aria-controls={open ? "menuProfile" : undefined}
						aria-haspopup="true"
						aria-expanded={open ? "true" : undefined}
						onClick={handleClick}
						sx={{
							display: "flex",
							flexDirection: "row",
							gap: 1,
							borderRadius: 999,
							pl: 0.5,
							pr: 1.5,
						}}
					>
						<Avatar
							sx={{
								width: 30,
								height: 30,
								fontSize: "0.9rem",
								fontWeight: 700,
								bgcolor: theme.vars.palette.accent.main,
								color: theme.vars.palette.accent.contrastText,
							}}
						>
							{session?.user?.userName?.charAt(0).toUpperCase()}
						</Avatar>
						<Typography
							component={"span"}
							sx={{
								fontSize: 15,
								fontWeight: 600,
								color: "text.primary",
							}}
						>
							{session?.user?.userName}
						</Typography>
					</IconButton>
					<Menu
						id="menuProfile"
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
						slotProps={{
							list: {
								"aria-labelledby": "buttonProfile",
							},
						}}
					>
						<MenuItem onClick={handleRedirectToProfile}>
							{session?.user?.role === "Admin"
								? "Go to Dashboard"
								: "My Profile"}
						</MenuItem>
						{session?.user?.role === "Admin" && (
							<MenuItem onClick={handleGoToHome}>
								<Typography variant="inherit">
									Go To Home
								</Typography>
							</MenuItem>
						)}
						<MenuItem onClick={handleLogout}>Log out</MenuItem>
					</Menu>
				</Box>
			</Toolbar>
		</AppBar>
	);
};

export default TopBar;
