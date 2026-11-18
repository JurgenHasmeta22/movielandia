"use client";

import React, { useState } from "react";
import Slider from "react-slick";
import { Box, Button, Typography, IconButton } from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import type {} from "@mui/material/themeCssVarsAugmentation";

interface CarouselItem {
	id: string | number;
	title?: string;
	fullname?: string;
	description: string;
	photoSrcProd: string;
}

interface CarouselProps {
	data: CarouselItem[];
	type: string;
}

interface ArrowProps {
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const CustomNextArrow = ({ onClick }: ArrowProps) => {
	return (
		<IconButton
			onClick={onClick}
			aria-label="Next slide"
			sx={{
				position: "absolute",
				top: "50%",
				right: { xs: "16px", sm: "24px", md: "32px" },
				transform: "translateY(-50%)",
				zIndex: 2,
				color: "white",
				backgroundColor: "rgba(0, 0, 0, 0.7)",
				width: { xs: 32, sm: 36, md: 40 },
				height: { xs: 32, sm: 36, md: 40 },
				transition: "all 0.2s ease-in-out",
				"&:hover": {
					backgroundColor: "#70d8bd",
					transform: "translateY(-50%) scale(1.05)",
				},
				"&:focus-visible": {
					outline: "2px solid #70d8bd",
					outlineOffset: 2,
				},
			}}
		>
			<NavigateNextIcon sx={{ fontSize: { xs: 20, sm: 24, md: 28 } }} />
		</IconButton>
	);
};

const CustomPrevArrow = ({ onClick }: ArrowProps) => {
	return (
		<IconButton
			onClick={onClick}
			aria-label="Previous slide"
			sx={{
				position: "absolute",
				top: "50%",
				left: { xs: "16px", sm: "24px", md: "32px" },
				transform: "translateY(-50%)",
				zIndex: 2,
				color: "white",
				backgroundColor: "rgba(0, 0, 0, 0.7)",
				width: { xs: 32, sm: 36, md: 40 },
				height: { xs: 32, sm: 36, md: 40 },
				transition: "all 0.2s ease-in-out",
				"&:hover": {
					backgroundColor: "#70d8bd",
					transform: "translateY(-50%) scale(1.05)",
				},
				"&:focus-visible": {
					outline: "2px solid #70d8bd",
					outlineOffset: 2,
				},
			}}
		>
			<NavigateBeforeIcon sx={{ fontSize: { xs: 20, sm: 24, md: 28 } }} />
		</IconButton>
	);
};

const Carousel = ({ data, type }: CarouselProps) => {
	const [currentSlide, setCurrentSlide] = useState(0);

	const settings = {
		dots: true,
		infinite: true,
		speed: 800,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		nextArrow: <CustomNextArrow />,
		prevArrow: <CustomPrevArrow />,
		fade: true,
		cssEase: "cubic-bezier(0.87, 0, 0.13, 1)",
		responsive: [
			{
				breakpoint: 960,
				settings: {
					arrows: true,
					dots: true,
				},
			},
			{
				breakpoint: 600,
				settings: {
					arrows: true,
					dots: true,
				},
			},
		],
		beforeChange: (_: number, next: number) => setCurrentSlide(next),
	};

	const getTitleOrName = (type: string, element: CarouselItem): string => {
		return type === "actors" || type === "crew"
			? element.fullname || ""
			: element.title || "";
	};

	const generateSlug = (text: string): string => {
		return encodeURIComponent(text.split(" ").join("-"));
	};

	return (
		<Box
			sx={{
				position: "relative",
				height: { xs: "520px", sm: "min(64vh, 640px)" },
				overflow: "hidden",
				mt: 1,
				mb: 0,
				background:
					"linear-gradient(115deg, #080b12 0%, #141b2d 58%, #1f2a40 100%)",
				"& .slick-slider": {
					height: "100%",
				},
				"& .slick-list": {
					height: "100%",
				},
				"& .slick-track": {
					height: "100%",
				},
				"& .slick-slide": {
					height: "100%",
					"& > div": {
						height: "100%",
					},
				},
				"& .slick-dots": {
					bottom: { xs: "12px", sm: "16px", md: "20px" },
					"& li button:before": {
						color: "#70d8bd",
					},
				},
			}}
		>
			<Slider {...settings}>
				{data.map((element, index) => (
					<Box
						key={index}
						sx={{
							position: "relative",
							height: { xs: "520px", sm: "min(64vh, 640px)" },
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							px: { xs: 2, sm: 4, md: 8 },
							py: { xs: 3, sm: 4 },
						}}
					>
						<Box
							sx={{
								position: "relative",
								width: "100%",
								height: "100%",
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "space-between",
								gap: { xs: 2, sm: 4, md: 7 },
								maxWidth: "1320px",
								mx: "auto",
							}}
						>
							<Box
								sx={{
									position: "relative",
									zIndex: 2,
									flexShrink: 0,
									display: "flex",
									alignItems: "center",
								}}
							>
								<Image
									src={element.photoSrcProd}
									alt={getTitleOrName(type, element)}
									height={400}
									width={280}
									priority
									style={{
										objectFit: "cover",
										objectPosition: "center",
										borderRadius: "8px",
										boxShadow:
											"0 22px 48px rgba(0, 0, 0, 0.38)",
										width: "clamp(116px, 22vw, 252px)",
										height: "auto",
										maxHeight: "min(42vh, 360px)",
									}}
								/>
							</Box>

							<Box
								sx={{
									position: { xs: "relative", md: "static" },
									zIndex: 2,
									width: "100%",
									maxWidth: { xs: "62%", md: "54%" },
									px: 0,
								}}
							>
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{
										opacity: currentSlide === index ? 1 : 0,
										y: currentSlide === index ? 0 : 20,
									}}
									transition={{
										duration: 0.5,
										ease: "easeOut",
									}}
								>
									<Typography
										variant="h1"
										component="h2"
										gutterBottom
										sx={{
											fontSize: {
												xs: "1.5rem",
												sm: "2.25rem",
												md: "3.25rem",
											},
											fontWeight: 700,
											color: "#eef0ef",
											letterSpacing: "-0.05em",
											lineHeight: 1.05,
											mb: 1.5,
										}}
									>
										{getTitleOrName(type, element)}
									</Typography>
									<Typography
										variant="body1"
										sx={{
											mb: 3,
											maxWidth: "800px",
											fontSize: {
												xs: "0.8rem",
												sm: "0.95rem",
												md: "1rem",
											},
											lineHeight: 1.7,
											color: "rgba(238, 240, 239, 0.78)",
											display: "-webkit-box",
											WebkitLineClamp: {
												xs: 4,
												sm: 5,
												md: 5,
											},
											WebkitBoxOrient: "vertical",
											overflow: "hidden",
											textOverflow: "ellipsis",
										}}
									>
										{element.description}
									</Typography>
									<Link
										href={`/${type}/${element.id}/${generateSlug(getTitleOrName(type, element))}`}
										passHref
									>
										<Button
											variant="contained"
											aria-label={`See details for ${getTitleOrName(type, element)}`}
											sx={{
												bgcolor: "#4cceac",
												color: "#080b12",
												fontSize: { xs: 14, sm: 16 },
												fontWeight: 600,
												px: { xs: 3, sm: 4 },
												py: 1.25,
												borderRadius: "6px",
												boxShadow: "none",
												textTransform: "none",
												transition:
													"background-color 180ms ease",
												"&:hover": {
													bgcolor: "#70d8bd",
													boxShadow: "none",
												},
												"&:focus-visible": {
													outline:
														"2px solid #70d8bd",
													outlineOffset: 2,
												},
											}}
										>
											See Details
										</Button>
									</Link>
								</motion.div>
							</Box>
						</Box>
					</Box>
				))}
			</Slider>
		</Box>
	);
};

export default Carousel;
