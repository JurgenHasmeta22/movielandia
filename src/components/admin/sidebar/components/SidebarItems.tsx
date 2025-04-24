import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import MovieIcon from "@mui/icons-material/Movie";
import PersonIcon from "@mui/icons-material/Person";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import ForumIcon from "@mui/icons-material/Forum";

export const SidebarItems = [
	{
		label: "Dashboard",
		to: "/admin/dashboard",
		icon: <HomeOutlinedIcon />,
		index: 0,
	},
	{
		label: "Users",
		to: "/admin/users",
		icon: <PeopleOutlinedIcon />,
		index: 1,
	},
	{
		label: "Movies",
		to: "/admin/movies",
		icon: <LocalMoviesIcon />,
		index: 2,
	},
	{
		label: "Series",
		to: "/admin/series",
		icon: <LiveTvIcon />,
		index: 3,
	},
	{
		label: "Seasons",
		to: "/admin/seasons",
		icon: <PlaylistPlayIcon />,
		index: 4,
	},
	{
		label: "Episodes",
		to: "/admin/episodes",
		icon: <PlayCircleOutlineIcon />,
		index: 5,
	},
	{
		label: "Actors",
		to: "/admin/actors",
		icon: <PersonIcon />,
		index: 6,
	},
	{
		label: "Crews",
		to: "/admin/crews",
		icon: <GroupWorkIcon />,
		index: 7,
	},
	{
		label: "Genres",
		to: "/admin/genres",
		icon: <MovieIcon />,
		index: 8,
	},
	{
		label: "Forum",
		to: "/admin/forum",
		icon: <ForumIcon />,
		index: 9,
	},
];
