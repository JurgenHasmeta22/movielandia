import { Stack, Box, Container } from "@mui/material";
import { Movie, Serie } from "@prisma/client";
import type { Metadata } from "next";
import HomeHeroSection from "./(home)/_components/HomeHero";
import ListHomeSection from "./(home)/_components/ListHomeSection";
import MarketingSection from "./(home)/_components/MarketingSection";
import NewsletterSection from "./(home)/_components/NewsletterSection";
import FaqSection from "./(home)/_components/FaqSection";
import TestimonialsSection from "./(home)/_components/TestimonialsSection";
import HowItWorksSection from "./(home)/_components/HowItWorksSection";
import { getMoviesForHomePage } from "@/actions/movie.actions";
import { getSeriesForHomePage } from "@/actions/serie.actions";


export const metadata: Metadata = {
	title: "MovieLandia24 - Your Ultimate Destination for Movies",
	description:
		"Welcome to MovieLandia24 - your ultimate destination for movies. Discover a vast collection of movies and enjoy streaming your favorites.",
	openGraph: {
		type: "video.tv_show",
		url: process.env.NEXT_PUBLIC_PROJECT_URL,
		title: "MovieLandia24 - Your Ultimate Destination for Movies",
		description:
			"Welcome to MovieLandia24 - your ultimate destination for movies. Discover a vast collection of movies and enjoy streaming your favorites.",
		siteName: "MovieLandia24",
	},
	twitter: {
		card: "summary_large_image",
		site: "@movieLandia24",
		creator: "movieLandia24",
		title: "MovieLandia24 - Your Ultimate Destination for Movies",
		description:
			"Welcome to MovieLandia24 - your ultimate destination for movies. Discover a vast collection of movies and enjoy streaming your favorites.",
	},
	robots: {
		index: true,
		follow: true,
	},
};

export default async function Home() {
	const movies: Movie[] = await getMoviesForHomePage();
	const series: Serie[] = await getSeriesForHomePage();

	return (
		<Box
			component="main"
			sx={{
				width: "100%",
				overflow: "hidden",
			}}
		>
			<HomeHeroSection />
			<MarketingSection />
			<HowItWorksSection />
			<Container maxWidth="xl">
				<Stack>
					<ListHomeSection
						key={"movie"}
						data={movies}
						type="movie"
						link="/movies"
						linkText="Explore all Movies"
					/>
					<ListHomeSection
						key={"serie"}
						data={series}
						type="serie"
						link="/series"
						linkText="Explore all Series"
					/>
				</Stack>
			</Container>
			<TestimonialsSection />
			<FaqSection />
			<NewsletterSection />
		</Box>
	);
}
