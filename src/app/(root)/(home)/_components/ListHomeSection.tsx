"use client";

import CardItem from "@/components/root/cardItem/CardItem";
import { Box, Stack, Typography, useTheme, IconButton } from "@mui/material";
import { Genre, Movie, Serie } from "@prisma/client";
import NextLink from "next/link";
import type {} from "@mui/material/themeCssVarsAugmentation";
import Slider from "react-slick";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState, useEffect } from "react";

type MovieWithBookmark = Pick<
	Movie,
	"id" | "title" | "photoSrcProd" | "description" | "ratingImdb" | "dateAired"
> & {
	isBookmarked?: boolean;
};

type SerieWithBookmark = Pick<
	Serie,
	"id" | "title" | "photoSrcProd" | "description" | "ratingImdb" | "dateAired"
> & {
	isBookmarked?: boolean;
};

interface IListHomeSectionProps {
	data: Array<MovieWithBookmark | SerieWithBookmark | Genre>;
	type: "movie" | "serie";
	link: string;
	linkText: string;
	path?: string;
}

const arrowSx = {
	position: "absolute",
	top: "42%",
	zIndex: 2,
	color: "#F3EEE6",
	backgroundColor: "rgba(13, 10, 18, 0.78)",
	backdropFilter: "blur(8px)",
	border: "1px solid rgba(243, 238, 230, 0.18)",
	width: { xs: 30, sm: 36, md: 42 },
	height: { xs: 30, sm: 36, md: 42 },
	boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
	"&:hover": {
		backgroundColor: "#FFB224",
		color: "#1A1100",
	},
};

const CustomNextArrow = (props: any) => {
	const { onClick } = props;

	return (
		<IconButton
			onClick={onClick}
			aria-label="Next titles"
			sx={{
				...arrowSx,
				right: { xs: "-8px", sm: "-12px", md: "-16px" },
				transform: "translateY(-50%)",
			}}
		>
			<NavigateNextIcon sx={{ fontSize: { xs: 18, sm: 20, md: 24 } }} />
		</IconButton>
	);
};

const CustomPrevArrow = (props: any) => {
	const { onClick } = props;

	return (
		<IconButton
			onClick={onClick}
			aria-label="Previous titles"
			sx={{
				...arrowSx,
				left: { xs: "-8px", sm: "-12px", md: "-16px" },
				transform: "translateY(-50%)",
			}}
		>
			<NavigateBeforeIcon sx={{ fontSize: { xs: 18, sm: 20, md: 24 } }} />
		</IconButton>
	);
};

const ListHomeSection = ({
	data,
	type,
	link,
	linkText,
	path,
}: IListHomeSectionProps) => {
	const theme = useTheme();
	const [slidesPerView, setSlidesPerView] = useState(6);

	useEffect(() => {
		const handleResize = () => {
			const width = window.innerWidth;

			if (width < 480) setSlidesPerView(1);
			else if (width < 600) setSlidesPerView(2);
			else if (width < 768) setSlidesPerView(3);
			else if (width < 1024) setSlidesPerView(4);
			else if (width < 1280) setSlidesPerView(5);
			else setSlidesPerView(6);
		};

		handleResize();
		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const getSectionTitle = () => {
		switch (type) {
			case "movie":
				return "Trending Movies";
			case "serie":
				return "Trending Series";
			default:
				return "";
		}
	};

	const transformItemToCardData = (
		item: MovieWithBookmark | SerieWithBookmark | Genre,
	) => {
		if (type === "movie") {
			const movieData = item as MovieWithBookmark;

			return {
				id: movieData.id,
				photoSrcProd: movieData.photoSrcProd,
				description: movieData.description,
				title: movieData.title,
				ratingImdb: movieData.ratingImdb,
				dateAired: movieData.dateAired,
				isBookmarked: movieData.isBookmarked,
			};
		} else if (type === "serie") {
			const serieData = item as SerieWithBookmark;

			return {
				id: serieData.id,
				photoSrcProd: serieData.photoSrcProd,
				description: serieData.description,
				title: serieData.title,
				ratingImdb: serieData.ratingImdb,
				dateAired: serieData.dateAired,
				isBookmarked: serieData.isBookmarked,
			};
		}

		return null;
	};

	return (
		<Box
			component="section"
			sx={{
				py: { xs: 4, md: 5 },
				px: { xs: 0, sm: 1 },
			}}
		>
			<Stack
				direction="row"
				sx={{
					justifyContent: "space-between",
					alignItems: "center",
					mb: { xs: 0, md: 1 },
					gap: 2,
				}}
			>
				<Box sx={{ display: "flex", alignItems: "center" }}>
					<Typography
						variant="h2"
						sx={{
							fontSize: { xs: 26, sm: 32, md: 40 },
							color: theme.vars.palette.text.primary,
						}}
					>
						{getSectionTitle()}
					</Typography>
				</Box>
				<NextLink
					href={link}
					style={{
						textDecoration: "none",
						color: "inherit",
						display: "flex",
						alignItems: "center",
						gap: "6px",
						whiteSpace: "nowrap",
					}}
				>
					<Typography
						sx={{
							fontWeight: 600,
							fontSize: { xs: 14, sm: 15 },
							color: theme.vars.palette.accent.main,
							px: 2,
							py: 0.75,
							borderRadius: 999,
							border: "1px solid",
							borderColor: "divider",
							transition:
								"background-color 0.2s ease, border-color 0.2s ease",
							"&:hover": {
								backgroundColor: "rgba(255, 178, 36, 0.12)",
								borderColor: theme.vars.palette.accent.main,
							},
						}}
					>
						{linkText}
					</Typography>
				</NextLink>
			</Stack>
			<Box
				sx={{
					width: "100%",
					overflow: "visible",
					mt: { xs: 2.5, md: 3.5 },
					px: { xs: 4, sm: 5, md: 6 },
					position: "relative",
					"& .slick-track": {
						display: "flex",
						margin: "0 -6px",
					},
					"& .slick-slide": {
						height: "auto",
						"& > div": {
							height: "100%",
						},
					},
				}}
			>
				<Slider
					dots={false}
					infinite={data.length > 6}
					speed={600}
					autoplay
					slidesToShow={slidesPerView}
					slidesToScroll={slidesPerView}
					cssEase="cubic-bezier(0.23, 1, 0.32, 1)"
					initialSlide={0}
					nextArrow={<CustomNextArrow />}
					prevArrow={<CustomPrevArrow />}
					responsive={[
						{
							breakpoint: 1280,
							settings: {
								slidesToShow: 5,
								slidesToScroll: 5,
							},
						},
						{
							breakpoint: 1024,
							settings: {
								slidesToShow: 4,
								slidesToScroll: 4,
							},
						},
						{
							breakpoint: 768,
							settings: {
								slidesToShow: 3,
								slidesToScroll: 3,
							},
						},
						{
							breakpoint: 600,
							settings: {
								slidesToShow: 2,
								slidesToScroll: 2,
							},
						},
						{
							breakpoint: 480,
							settings: {
								slidesToShow: 1,
								slidesToScroll: 1,
							},
						},
					]}
				>
					{data?.map((item, index) => {
						const cardData = transformItemToCardData(item);

						if (!cardData) {
							return null;
						}

						return (
							<Box
								key={index}
								sx={{
									px: 0.75,
								}}
							>
								<CardItem
									data={cardData}
									type={type}
									path={path}
									presentation="poster"
								/>
							</Box>
						);
					})}
				</Slider>
			</Box>
		</Box>
	);
};

export default ListHomeSection;
