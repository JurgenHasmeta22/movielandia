import GenreItem from "@/components/root/genreItem/GenreItem";
import { getGenres } from "@/actions/genre.actions";
import { Box, Stack, Typography } from "@mui/material";
import { Genre } from "@prisma/client";
import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_PROJECT_URL;

export const metadata: Metadata = {
	title: "Watch the Latest Genres | High-Quality and Always Updated",
	description:
		"Discover and watch the latest and most amazing genres in high quality. Our collection is always updated with the newest episodes and releases.",
	openGraph: {
		type: "video.tv_show",
		url: `${baseUrl}/genres`,
		title: "Watch the Latest Genres | High-Quality and Always Updated",
		description:
			"Discover and watch the latest and most amazing genres in high quality. Our collection is always updated with the newest episodes and releases.",
		siteName: "MovieLandia24",
	},
	twitter: {
		card: "summary_large_image",
		site: "@movieLandia24",
		creator: "movieLandia24",
		title: "Watch the Latest Genres | High-Quality and Always Updated",
		description:
			"Discover and watch the latest and most amazing genres in high quality. Our collection is always updated with the newest episodes and releases.",
	},
	robots: {
		index: true,
		follow: true,
	},
};

export default async function Genres() {
	const genres = await getGenres();

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				placeItems: "center",
				pt: 4,
				mt: 4,
				mb: 4,
				mr: 3,
				ml: 3,
			}}
			component={"section"}
		>
			<Typography
				sx={{
					mt: 4,
				}}
				fontSize={"26px"}
			>
				Choose your favorite genre
			</Typography>
			<Stack
				direction="row"
				flexWrap="wrap"
				alignItems={"start"}
				rowGap={5}
				columnGap={5}
				sx={{
					pl: 3,
					mt: 3,
					mb: 4,
					justifyContent: {
						xs: "center",
						sm: "center",
						md: "start",
						lg: "start",
					},
				}}
			>
				{genres?.length! > 0 ? (
					genres?.map((genre: Genre, index: number) => (
						<GenreItem key={index} genre={genre} />
					))
				) : (
					<Typography>No genres available.</Typography>
				)}
			</Stack>
		</Box>
	);
}
