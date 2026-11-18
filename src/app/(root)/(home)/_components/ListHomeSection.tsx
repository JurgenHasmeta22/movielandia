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

const CustomNextArrow = (props: any) => {
	const { onClick } = props;
	const theme = useTheme();

	return (
		<IconButton
			onClick={onClick}
			sx={{
				position: "absolute",
				top: "50%",
				right: { xs: "-12px", sm: "-15px", md: "-18px" },
				transform: "translateY(-50%)",
				zIndex: 2,
				color: theme.vars.palette.common.white,
				backgroundColor: "rgba(0, 0, 0, 0.7)",
				width: { xs: 24, sm: 28, md: 32 },
				height: { xs: 24, sm: 28, md: 32 },
				boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
				"&:hover": {
					backgroundColor: theme.vars.palette.primary.main,
				},
			}}
		>
			<NavigateNextIcon sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }} />
		</IconButton>
	);
};

const CustomPrevArrow = (props: any) => {
	const { onClick } = props;
	const theme = useTheme();

	return (
		<IconButton
			onClick={onClick}
			sx={{
				position: "absolute",
				top: "50%",
				left: { xs: "-12px", sm: "-15px", md: "-18px" },
				transform: "translateY(-50%)",
				zIndex: 2,
				color: theme.vars.palette.common.white,
				backgroundColor: "rgba(0, 0, 0, 0.7)",
				width: { xs: 24, sm: 28, md: 32 },
				height: { xs: 24, sm: 28, md: 32 },
				boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
				"&:hover": {
					backgroundColor: theme.vars.palette.primary.main,
				},
			}}
		>
			<NavigateBeforeIcon sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }} />
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
							fontWeight: 800,
							fontSize: { xs: 22, sm: 26, md: 30 },
							color: theme.vars.palette.text.primary,
							letterSpacing: "-0.04em",
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
							fontWeight: 700,
							fontSize: { xs: 14, sm: 16 },
							color: theme.vars.palette.green.light,
							transition: "color 0.2s ease",
							"&:hover": {
								color: theme.vars.palette.green.light,
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
