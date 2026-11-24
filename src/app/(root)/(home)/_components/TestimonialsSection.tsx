"use client";

import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Avatar, Rating } from "@mui/material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import { motion, type Variants } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SectionHeading from "@/components/root/sectionHeading/SectionHeading";

const testimonials = [
	{
		name: "Sarah Johnson",
		avatar: "/images/avatars/avatar1.jpg",
		role: "Film Enthusiast",
		rating: 5,
		text: "MovieLandia24 has completely transformed how I discover new films. The recommendations are spot-on, and I love being able to create custom watchlists for different moods and occasions.",
	},
	{
		name: "Michael Chen",
		avatar: "/images/avatars/avatar2.jpg",
		role: "TV Series Buff",
		rating: 4.5,
		text: "As someone who watches a lot of TV series, I appreciate how well-organized everything is on MovieLandia24. The episode tracking feature is particularly useful, and the community discussions add so much value.",
	},
	{
		name: "Emma Rodriguez",
		avatar: "/images/avatars/avatar3.jpg",
		role: "Aspiring Filmmaker",
		rating: 5,
		text: "The depth of information about directors, cinematographers, and other crew members is impressive. MovieLandia24 has become an invaluable resource for my film studies and creative projects.",
	},
	{
		name: "David Wilson",
		avatar: "/images/avatars/avatar4.jpg",
		role: "Movie Collector",
		rating: 4.5,
		text: "I've been using MovieLandia24 to catalog my personal collection, and it's been a game-changer. The interface is intuitive, and the database is incredibly comprehensive.",
	},
	{
		name: "Olivia Thompson",
		avatar: "/images/avatars/avatar5.jpg",
		role: "Cinema Critic",
		rating: 5,
		text: "The review system on MovieLandia24 is exceptional. I can express my thoughts in detail, and the community engagement with reviews creates meaningful conversations about cinema.",
	},
];

const containerVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { staggerChildren: 0.1, ease: "easeOut" },
	},
};

const itemVariants: Variants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5, ease: "easeOut" },
	},
};

const TestimonialsSection = () => {
	const [slidesToShow, setSlidesToShow] = useState(3);

	useEffect(() => {
		const handleResize = () => {
			const width = window.innerWidth;
			if (width < 600) setSlidesToShow(1);
			else if (width < 960) setSlidesToShow(2);
			else setSlidesToShow(3);
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: slidesToShow,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 5000,
		pauseOnHover: true,
		arrows: false,
		adaptiveHeight: false,
		responsive: [
			{
				breakpoint: 960,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				},
			},
		],
	};

	return (
		<Box
			component="section"
			sx={{
				py: { xs: 8, md: 12 },
				position: "relative",
				width: "100%",
				overflow: "hidden",
			}}
		>
			<Container maxWidth="xl" sx={{ px: { xs: 2.5, sm: 4, md: 6 } }}>
				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.3 }}
					variants={containerVariants}
				>
					<motion.div variants={itemVariants}>
						<SectionHeading
							eyebrow="User Testimonials"
							title="What Our Community Says"
							description="Join thousands of satisfied users who have discovered their next favorite movies and shows through MovieLandia24."
						/>
					</motion.div>

					<Box
						sx={{
							mx: -1.5,
							"& .slick-slide > div": { height: "100%" },
							"& .slick-track": { display: "flex" },
							"& .slick-slide": { height: "auto" },
							"& .slick-dots li button:before": {
								color: "var(--mui-palette-accent-main)",
							},
							"& .slick-dots": { bottom: -36 },
						}}
					>
						<Slider {...settings}>
							{testimonials.map((testimonial) => (
								<Box
									key={testimonial.name}
									sx={{ px: 1.5, pb: 1, height: "100%" }}
								>
									<Box
										sx={{
											p: 3.5,
											height: "100%",
											display: "flex",
											flexDirection: "column",
											borderRadius: "24px",
											border: "1px solid",
											borderColor: "divider",
											backgroundColor: "background.paper",
										}}
									>
										<FormatQuoteIcon
											sx={{
												fontSize: 44,
												mb: 1,
												color: "accent.main",
											}}
										/>
										<Typography
											sx={{
												fontSize: "1rem",
												color: "text.primary",
												lineHeight: 1.7,
												mb: 3,
												flexGrow: 1,
												minHeight: {
													xs: "auto",
													sm: "120px",
													md: "150px",
												},
											}}
										>
											&quot;{testimonial.text}&quot;
										</Typography>
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												mt: "auto",
												pt: 2.5,
												borderTop: "1px solid",
												borderColor: "divider",
											}}
										>
											<Avatar
												src={testimonial.avatar}
												alt={testimonial.name}
												sx={{
													width: 48,
													height: 48,
													mr: 2,
													border: "2px solid",
													borderColor: "accent.main",
												}}
											/>
											<Box>
												<Typography
													sx={{
														fontWeight: 600,
														fontSize: "0.95rem",
													}}
												>
													{testimonial.name}
												</Typography>
												<Typography
													sx={{
														color: "text.secondary",
														fontSize: "0.85rem",
													}}
												>
													{testimonial.role}
												</Typography>
												<Rating
													value={testimonial.rating}
													precision={0.5}
													readOnly
													size="small"
													sx={{
														mt: 0.5,
														"& .MuiRating-iconFilled":
															{
																color: "accent.main",
															},
													}}
												/>
											</Box>
										</Box>
									</Box>
								</Box>
							))}
						</Slider>
					</Box>
				</motion.div>
			</Container>
		</Box>
	);
};

export default TestimonialsSection;
