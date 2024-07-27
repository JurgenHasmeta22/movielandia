import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import MovieIcon from "@mui/icons-material/Movie";

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
        label: "Genres",
        to: "/admin/genres",
        icon: <MovieIcon />,
        index: 3,
    },
    {
        label: "Series",
        to: "/admin/series",
        icon: <LiveTvIcon />,
        index: 4,
    },
];
