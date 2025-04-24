"use client";

import { Box, useTheme } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MovieIcon from "@mui/icons-material/Movie";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import CategoryIcon from "@mui/icons-material/Category";
import PersonIcon from "@mui/icons-material/Person";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import type {} from "@mui/material/themeCssVarsAugmentation";
import { DashboardStatBox } from "./DashboardStatBox";
import HeaderDashboard from "@/components/admin/headerDashboard/HeaderDashboard";
import type { DashboardStats } from "../_actions/getDashboardStats";

interface DashboardAdminPageProps {
	stats: DashboardStats;
}

const DashboardAdminPage = ({ stats }: DashboardAdminPageProps) => {
	const theme = useTheme();

	const StatBoxWrapper = ({ children }: { children: React.ReactNode }) => (
		<Box
			sx={{
				backgroundColor: theme.vars.palette.background.paper,
				borderRadius: 2,
				p: 3,
				boxShadow: theme.vars.palette.stats.boxShadow,
				transition: "all 0.3s ease-in-out",
				"&:hover": {
					transform: "translateY(-4px)",
					boxShadow: theme.vars.palette.stats.hoverShadow,
					"& .stat-icon": {
						transform: "scale(1.1)",
					},
				},
				minHeight: "200px",
				width: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
			}}
		>
			{children}
		</Box>
	);

	return (
		<Box
			sx={{
				p: { xs: 2, sm: 3 },
				width: "100%",
				maxWidth: "100%",
				overflow: "hidden",
			}}
		>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				mb={4}
			>
				<HeaderDashboard
					title="Dashboard"
					subtitle="Welcome to your MovieLandia24 Admin Dashboard"
				/>
			</Box>

			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: {
						xs: "1fr",
						sm: "repeat(2, 1fr)",
						md: "repeat(3, 1fr)",
						lg: "repeat(4, 1fr)",
					},
					gap: { xs: 2, sm: 2.5, md: 3 },
					width: "100%",
				}}
			>
				{/* Movies */}
				<StatBoxWrapper>
					<DashboardStatBox
						title={stats.totalMovies.toString()}
						subtitle="Movies"
						progress={0.75}
						increase="Total"
						icon={
							<MovieIcon
								sx={{
									color: theme.vars.palette.primary.main,
									fontSize: 32,
								}}
							/>
						}
					/>
				</StatBoxWrapper>

				{/* TV Series */}
				<StatBoxWrapper>
					<DashboardStatBox
						title={stats.totalSeries.toString()}
						subtitle="TV Series"
						progress={0.65}
						increase="Total"
						icon={
							<LiveTvIcon
								sx={{
									color: theme.vars.palette.primary.main,
									fontSize: 32,
								}}
							/>
						}
					/>
				</StatBoxWrapper>

				{/* Users */}
				<StatBoxWrapper>
					<DashboardStatBox
						title={stats.totalUsers.toString()}
						subtitle="Users"
						progress={0.5}
						increase="Total"
						icon={
							<PersonAddIcon
								sx={{
									color: theme.vars.palette.primary.main,
									fontSize: 32,
								}}
							/>
						}
					/>
				</StatBoxWrapper>

				{/* Genres */}
				<StatBoxWrapper>
					<DashboardStatBox
						title={stats.totalGenres.toString()}
						subtitle="Genres"
						progress={0.8}
						increase="Total"
						icon={
							<CategoryIcon
								sx={{
									color: theme.vars.palette.primary.main,
									fontSize: 32,
								}}
							/>
						}
					/>
				</StatBoxWrapper>

				{/* Actors */}
				<StatBoxWrapper>
					<DashboardStatBox
						title={stats.totalActors.toString()}
						subtitle="Actors"
						progress={0.7}
						increase="Total"
						icon={
							<PersonIcon
								sx={{
									color: theme.vars.palette.primary.main,
									fontSize: 32,
								}}
							/>
						}
					/>
				</StatBoxWrapper>

				{/* Episodes */}
				<StatBoxWrapper>
					<DashboardStatBox
						title={stats.totalEpisodes.toString()}
						subtitle="Episodes"
						progress={0.6}
						increase="Total"
						icon={
							<PlaylistPlayIcon
								sx={{
									color: theme.vars.palette.primary.main,
									fontSize: 32,
								}}
							/>
						}
					/>
				</StatBoxWrapper>

				{/* Seasons */}
				<StatBoxWrapper>
					<DashboardStatBox
						title={stats.totalSeasons.toString()}
						subtitle="Seasons"
						progress={0.55}
						increase="Total"
						icon={
							<VideoLibraryIcon
								sx={{
									color: theme.vars.palette.primary.main,
									fontSize: 32,
								}}
							/>
						}
					/>
				</StatBoxWrapper>
			</Box>
		</Box>
	);
};

export default DashboardAdminPage;
