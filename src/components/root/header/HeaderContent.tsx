"use client";

import { useStore } from "@/store/store";
import { AppBar, Box, IconButton, Toolbar, useTheme } from "@mui/material";
import AuthButtons from "../authButtons/AuthButtons";
import ThemeToggleButton from "../themeToggleButton/ThemeToggleButton";
import MenuIcon from "@mui/icons-material/Menu";
import { HeaderLinks } from "./HeaderLinks";
import { Genre } from "@prisma/client";
import { Session } from "next-auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import HeaderMobile from "../headerMobile/HeaderMobile";
import { showToast } from "@/utils/helpers/toast";
import SearchField from "../searchField/SearchField";
import type {} from "@mui/material/themeCssVarsAugmentation";
import NotificationMenu from "../notificationMenu/NotificationMenu";
import MessageCounter from "./MessageCounter";

interface IHeaderContentProps {
	session: Session | null;
	genres: Genre[];
	userName: string;
}

export function HeaderContent({
	session,
	genres,
	userName,
}: IHeaderContentProps) {
	const [anchorElProfile, setAnchorElProfile] = useState<null | HTMLElement>(
		null,
	);
	const [isSearchFocused, setIsSearchFocused] = useState(false);
	const { isDrawerOpen, setIsDrawerOpen } = useStore();

	const theme = useTheme();
	const router = useRouter();

	const openMenuProfile = (event: any) => {
		setAnchorElProfile(event.currentTarget);
	};

	const closeMenuProfile = () => {
		setAnchorElProfile(null);
	};

	const handleSignOut = async () => {
		closeMenuProfile();

		await signOut({ redirect: false });

		if (isDrawerOpen) {
			setIsDrawerOpen(false);
		}

		showToast(
			"success",
			"Logout successful! You will be redirected shortly.",
		);
		router.push("/login");
		router.refresh();
	};

	const handleSearchFocusChange = (focused: boolean) => {
		setIsSearchFocused(focused);
	};

	return (
		<>
			<AppBar position="fixed" component={"header"}>
				<Toolbar
					sx={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between",
						flexWrap: "nowrap",
						py: 1.5,
						backgroundColor: theme.vars.palette.primary.dark,
						minHeight: { xs: 64, sm: 72 },
						px: { xs: 1, sm: 2 },
					}}
					component={"nav"}
				>
					{/* Mobile Menu Button - Only show on mobile */}
					<Box
						sx={{
							display: { xs: "block", md: "none" },
							order: { xs: 1, md: 0 },
						}}
					>
						<IconButton
							aria-label="open drawer"
							edge="start"
							onClick={() => setIsDrawerOpen(true)}
							sx={{
								color: theme.vars.palette.primary.main,
								"&:hover": {
									color: theme.vars.palette.green.main,
								},
							}}
						>
							<MenuIcon />
						</IconButton>
					</Box>

					{/* Desktop Navigation */}
					<Box
						sx={{
							display: { xs: "none", md: "flex" },
							width: "100%",
							alignItems: "center",
						}}
					>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								flex: "0 0 auto",
							}}
						>
							<HeaderLinks genres={genres} />
						</Box>

						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 0.5,
								ml: "auto",
								flex: "0 0 auto",
							}}
						>
							<SearchField
								onFocusChange={handleSearchFocusChange}
								onClose={() => setIsSearchFocused(false)}
							/>
							{!isSearchFocused && (
								<>
									{session?.user && (
										<>
											<MessageCounter session={session} />
											<NotificationMenu
												session={session}
											/>
										</>
									)}
									<ThemeToggleButton />
									<AuthButtons
										session={session}
										userName={userName}
										anchorElProfile={anchorElProfile}
										closeMenuProfile={closeMenuProfile}
										openMenuProfile={openMenuProfile}
										handleSignOut={handleSignOut}
									/>
								</>
							)}
						</Box>
					</Box>

					{/* Mobile Header */}
					<HeaderMobile
						genres={genres}
						anchorElProfile={anchorElProfile}
						openMenuProfile={openMenuProfile}
						closeMenuProfile={closeMenuProfile}
						handleSignOut={handleSignOut}
						session={session}
						userName={userName}
					/>
				</Toolbar>
			</AppBar>
		</>
	);
}
