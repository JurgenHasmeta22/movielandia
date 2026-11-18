import { Box, Typography, useTheme } from "@mui/material";
import CardItem, { CardItemType, PathType } from "../cardItem/CardItem";
import type {} from "@mui/material/themeCssVarsAugmentation";

interface IListDetailProps {
	data: any;
	type: CardItemType;
	roleData: string;
}

export function ListDetail({ data, type, roleData }: IListDetailProps) {
	const theme = useTheme();

	if (!data || data.length === 0) return null;

	const getTitle = () => {
		if (type === "actor") {
			return roleData === "cast" ? "Cast" : `Starred ${roleData}`;
		}

		if (type === "crew") {
			return roleData === "production" ? "Crew" : `Worked on ${roleData}`;
		}

		return `${roleData === "related" ? "Related" : ""} ${
			type === "movie"
				? "Movies"
				: type === "serie"
					? "Series"
					: type === "season"
						? "Seasons"
						: type === "episode"
							? "Episodes"
							: ""
		}`;
	};

	const getItemData = (item: any) => {
		if (type === "actor") {
			if (roleData === "Movies") return item.movie;
			if (roleData === "Series") return item.serie;
			if (roleData === "cast") return item.actor;
		}

		if (type === "crew") {
			if (roleData === "production") return item.crew;
			if (roleData === "Movies") return item.movie;
			if (roleData === "Series") return item.serie;
		}

		return item;
	};

	const getItemPath = () => {
		if (type === "actor") {
			if (roleData === "Movies") return "movies";
			if (roleData === "Series") return "series";
			if (roleData === "cast") return "actors";
		}

		if (type === "crew") {
			if (roleData === "Movies") return "movies";
			if (roleData === "Series") return "series";
			if (roleData === "production") return "crew";
		}

		return null;
	};

	return (
		<Box
			component="section"
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: { xs: 3, md: 4 },
				width: "100%",
				maxWidth: "1320px",
				margin: "0 auto",
				px: { xs: 2, sm: 3, md: 4, xl: 0 },
			}}
		>
			<Box
				sx={{
					mb: { xs: 0.5, md: 1 },
					display: "flex",
					justifyContent: "flex-start",
				}}
			>
				<Typography
					variant="h2"
					sx={{
						fontSize: { xs: 24, sm: 28, md: 32 },
						fontWeight: 700,
						color: theme.vars.palette.text.primary,
						letterSpacing: "-0.04em",
					}}
				>
					{getTitle()}
				</Typography>
			</Box>
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: {
						xs: "repeat(2, minmax(0, 1fr))",
						sm: "repeat(3, minmax(0, 1fr))",
						md: "repeat(4, minmax(0, 1fr))",
						lg: "repeat(5, minmax(0, 1fr))",
						xl: "repeat(6, minmax(0, 1fr))",
					},
					gap: { xs: 1.5, sm: 2.5, md: 3 },
					width: "100%",
				}}
			>
				{data.map((item: any, index: number) => (
					<CardItem
						key={index}
						data={getItemData(item)}
						type={type}
						path={getItemPath()!}
						presentation="poster"
					/>
				))}
			</Box>
		</Box>
	);
}

export default ListDetail;
