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

type MovieWithBookmark = Movie & {
	isBookmarked?: boolean;
};

type SerieWithBookmark = Serie & {
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
				py: { xs: 3, md: 4 },
				px: { xs: 2, sm: 3, md: 4 },
			}}
		>
			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="center"
				sx={{ mb: { xs: 1, md: 2 } }}
			>
				<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
					<Typography
						variant="h2"
						sx={{
							fontWeight: 800,
							fontSize: { xs: 24, sm: 28, md: 32 },
							color: theme.vars.palette.text.primary,
							position: "relative",
							display: "inline-block",
							"&::after": {
								content: '""',
								position: "absolute",
								bottom: -8,
								left: 0,
								width: "100%",
								height: 3,
								backgroundColor:
									theme.vars.palette.primary.main,
								borderRadius: 1,
							},
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
						gap: "4px",
						transition: "all 0.2s ease",
					}}
				>
					<Typography
						sx={{
							fontWeight: 700,
							fontSize: { xs: 14, sm: 16 },
							color: theme.vars.palette.primary.main,
							transition: "opacity 0.2s ease",
							"&:hover": {
								opacity: 0.8,
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
					mt: { xs: 4, md: 5 },
					px: { xs: 6, sm: 8, md: 10 },
					position: "relative",
					"& .slick-track": {
						display: "flex",
						margin: "0 -8px",
					},
					"& .slick-slide": {
						height: "auto",
						opacity: 0.85,
						transition: "all 0.3s ease",
						transform: "scale(0.95)",
						"& > div": {
							height: "100%",
						},
					},
					"& .slick-active": {
						opacity: 1,
						transform: "scale(1)",
					},
					"& .slick-current": {
						opacity: 1,
						transform: "scale(1.02)",
					},
				}}
			>
				<Slider
					dots={false}
					infinite={data.length > 6}
					speed={600}
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
									px: 1,
								}}
							>
								<CardItem
									data={cardData}
									type={type}
									path={path}
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
