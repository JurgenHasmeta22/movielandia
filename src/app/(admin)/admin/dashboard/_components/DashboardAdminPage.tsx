"use client";

import { Box } from "@mui/material";
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

const statIconSx = { color: "accent.main", fontSize: 28 };

const StatBoxWrapper = ({ children }: { children: React.ReactNode }) => (
	<Box
		sx={{
			position: "relative",
			overflow: "hidden",
			backgroundColor: "background.paper",
			border: "1px solid",
			borderColor: "divider",
			borderRadius: "20px",
			p: 3,
			transition: "transform 0.25s ease, border-color 0.25s ease",
			"&::after": {
				content: '""',
				position: "absolute",
				top: 0,
				right: 0,
				width: 140,
				height: 140,
				background:
					"radial-gradient(circle at 100% 0%, rgba(255, 178, 36, 0.14), transparent 70%)",
				pointerEvents: "none",
			},
			"&:hover": {
				transform: "translateY(-4px)",
				borderColor: "accent.main",
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

const DashboardAdminPage = ({ stats }: DashboardAdminPageProps) => {
	const items = [
		{
			title: stats.totalMovies,
			subtitle: "Movies",
			progress: 0.75,
			icon: <MovieIcon sx={statIconSx} />,
		},
		{
			title: stats.totalSeries,
			subtitle: "TV Series",
			progress: 0.65,
			icon: <LiveTvIcon sx={statIconSx} />,
		},
		{
			title: stats.totalUsers,
			subtitle: "Users",
			progress: 0.5,
			icon: <PersonAddIcon sx={statIconSx} />,
		},
		{
			title: stats.totalGenres,
			subtitle: "Genres",
			progress: 0.8,
			icon: <CategoryIcon sx={statIconSx} />,
		},
		{
			title: stats.totalActors,
			subtitle: "Actors",
			progress: 0.7,
			icon: <PersonIcon sx={statIconSx} />,
		},
		{
			title: stats.totalEpisodes,
			subtitle: "Episodes",
			progress: 0.6,
			icon: <PlaylistPlayIcon sx={statIconSx} />,
		},
		{
			title: stats.totalSeasons,
			subtitle: "Seasons",
			progress: 0.55,
			icon: <VideoLibraryIcon sx={statIconSx} />,
		},
	];

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
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
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
				{items.map((item) => (
					<StatBoxWrapper key={item.subtitle}>
						<DashboardStatBox
							title={item.title.toString()}
							subtitle={item.subtitle}
							progress={item.progress}
							increase="Total"
							icon={item.icon}
						/>
					</StatBoxWrapper>
				))}
			</Box>
		</Box>
	);
};

export default DashboardAdminPage;
