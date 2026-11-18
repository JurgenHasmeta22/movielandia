import GenreItem from "@/components/root/genreItem/GenreItem";
import { getGenres } from "@/actions/genre.actions";
import { Box, Typography } from "@mui/material";
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
				maxWidth: "1320px",
				mx: "auto",
				px: { xs: 2, sm: 3, md: 4 },
				pt: { xs: 4, md: 7 },
				pb: { xs: 6, md: 9 },
			}}
			component="section"
		>
			<Typography
				component="h1"
				variant="h2"
				sx={{
					mb: 1.5,
					fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
					fontWeight: 700,
					letterSpacing: "-0.05em",
				}}
			>
				Choose your favorite genre
			</Typography>
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: {
						xs: "repeat(2, minmax(0, 1fr))",
						sm: "repeat(3, minmax(0, 1fr))",
						md: "repeat(4, minmax(0, 1fr))",
						lg: "repeat(5, minmax(0, 1fr))",
					},
					gap: { xs: 1.5, sm: 2, md: 2.5 },
					mt: { xs: 3, md: 4 },
				}}
			>
				{genres?.length! > 0 ? (
					genres?.map((genre: Genre, index: number) => (
						<GenreItem key={index} genre={genre} />
					))
				) : (
					<Typography>No genres available.</Typography>
				)}
			</Box>
		</Box>
	);
}
