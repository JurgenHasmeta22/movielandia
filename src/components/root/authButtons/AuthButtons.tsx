"use client";

import React from "react";
import {
	Button,
	Typography,
	Menu,
	MenuItem,
	useTheme,
	Box,
} from "@mui/material";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import { Session } from "next-auth";
import { useStore } from "@/store/store";
import MuiNextLink from "../muiNextLink/MuiNextLink";
import { useRouter } from "next/navigation";
import type {} from "@mui/material/themeCssVarsAugmentation";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LoginIcon from "@mui/icons-material/Login";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

interface IAuthButtonsProps {
	session: Session | null;
	anchorElProfile: HTMLElement | null;
	userName: string;
	openMenuProfile: (event: any) => void;
	closeMenuProfile: () => void;
	handleSignOut: () => Promise<void>;
}

const AuthButtons = ({
	session,
	anchorElProfile,
	openMenuProfile,
	closeMenuProfile,
	handleSignOut,
	userName,
}: IAuthButtonsProps) => {
	const { isDrawerOpen, setIsDrawerOpen } = useStore();
	const theme = useTheme();
	const router = useRouter();

	const handleProfileClick = () => {
		closeMenuProfile();

		if (session?.user?.role === "Admin") {
			router.push("/admin");
		} else {
			router.push(`/users/${session?.user?.id}/${userName}`);
		}
	};

	return (
		<>
			{session && session.user ? (
				<>
					<AccountCircleOutlinedIcon
						onClick={openMenuProfile}
						sx={{
							color: theme.vars.palette.text.primary,
							fontSize: "1.9rem",
							cursor: "pointer",
							borderRadius: "50%",
							transition: "color 200ms ease",
							"&:hover": {
								color: theme.vars.palette.accent.main,
							},
						}}
					/>
					<Menu
						anchorEl={anchorElProfile}
						open={Boolean(anchorElProfile)}
						onClose={closeMenuProfile}
						disableScrollLock
						anchorOrigin={{
							vertical: "bottom",
							horizontal: "left",
						}}
						transformOrigin={{
							vertical: "top",
							horizontal: "left",
						}}
						slotProps={{
							paper: {
								sx: {
									mt: 1,
									"& .MuiMenuItem-root": {
										px: 2,
										py: 1,
										borderRadius: 1,
										display: "flex",
										alignItems: "center",
										gap: 1.5,
										"& .MuiSvgIcon-root": {
											fontSize: "1.25rem",
											color: theme.vars.palette.primary
												.main,
										},
										"&:hover": {
											backgroundColor:
												theme.vars.palette.action.hover,
											"& .MuiSvgIcon-root": {
												color: theme.vars.palette.accent
													.main,
											},
											"& .MuiTypography-root": {
												color: theme.vars.palette.accent
													.main,
											},
										},
									},
								},
							},
						}}
					>
						<MenuItem onClick={handleProfileClick}>
							{session?.user?.role === "Admin" ? (
								<>
									<DashboardIcon />
									<Typography
										variant="inherit"
										sx={{ fontSize: "0.95rem" }}
									>
										Go to Dashboard
									</Typography>
								</>
							) : (
								<>
									<PersonOutlinedIcon />
									<Typography
										variant="inherit"
										sx={{ fontSize: "0.95rem" }}
									>
										My Profile
									</Typography>
								</>
							)}
						</MenuItem>
						<MenuItem onClick={() => handleSignOut()}>
							<LogoutIcon />
							<Typography
								variant="inherit"
								sx={{ fontSize: "0.95rem" }}
							>
								Sign Out
							</Typography>
						</MenuItem>
					</Menu>
				</>
			) : (
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						flexShrink: 0,
						gap: 1,
					}}
				>
					<Button
						LinkComponent={MuiNextLink}
						href="/login"
						variant="text"
						color="primary"
						startIcon={<LoginIcon />}
						sx={{ flexShrink: 0 }}
						onClick={() => {
							if (isDrawerOpen) {
								setIsDrawerOpen(false);
							}
						}}
					>
						Sign In
					</Button>
					<Button
						LinkComponent={MuiNextLink}
						href="/register"
						variant="contained"
						color="primary"
						startIcon={<PersonAddIcon />}
						sx={{ flexShrink: 0 }}
						onClick={() => {
							if (isDrawerOpen) {
								setIsDrawerOpen(false);
							}
						}}
					>
						Sign Up
					</Button>
				</Box>
			)}
		</>
	);
};

export default AuthButtons;
