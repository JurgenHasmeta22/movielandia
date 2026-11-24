"use client";

import React, { useState } from "react";
import {
	Box,
	Container,
	Typography,
	Accordion,
	AccordionSummary,
	AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { motion, type Variants } from "framer-motion";
import SectionHeading from "@/components/root/sectionHeading/SectionHeading";

const faqs = [
	{
		question: "What is MovieLandia24?",
		answer: "MovieLandia24 is a comprehensive cinema platform where you can discover, explore, and engage with movies, TV series, actors, and crew. Create an account to write reviews, rate content, build custom lists, and connect with other film enthusiasts.",
	},
	{
		question: "Is MovieLandia24 free to use?",
		answer: "Yes, MovieLandia24 is completely free to use. Create an account to access all features including personalized recommendations, watchlists, and community interactions.",
	},
	{
		question: "How do I create a watchlist?",
		answer: "After signing in, you can add any movie or TV show to your watchlist by clicking the bookmark icon on the content card. Access your watchlist anytime from your profile page.",
	},
	{
		question: "Can I write reviews for movies and TV shows?",
		answer: "Absolutely! Once you're signed in, navigate to any movie or TV show page and scroll down to the reviews section. Click on 'Write a Review' to share your thoughts and rating.",
	},
	{
		question: "How are movie and TV show ratings calculated?",
		answer: "Ratings are calculated based on the average of all user ratings. Each user can rate content on a scale of 1 to 10, and these ratings are aggregated to provide an overall score.",
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

const FaqSection = () => {
	const [expanded, setExpanded] = useState<string | false>(false);

	const handleChange =
		(panel: string) =>
		(event: React.SyntheticEvent, isExpanded: boolean) => {
			setExpanded(isExpanded ? panel : false);
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
			<Container maxWidth="lg" sx={{ px: { xs: 2.5, sm: 4 } }}>
				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.3 }}
					variants={containerVariants}
				>
					<motion.div variants={itemVariants}>
						<SectionHeading
							eyebrow="Frequently Asked Questions"
							title="Got Questions? We've Got Answers"
							description="Find answers to the most common questions about MovieLandia24 and how to make the most of your experience."
						/>
					</motion.div>

					<Box>
						{faqs.map((faq, index) => (
							<motion.div
								key={faq.question}
								variants={itemVariants}
							>
								<Accordion
									expanded={expanded === `panel${index}`}
									onChange={handleChange(`panel${index}`)}
									sx={{ mb: 1.5, backgroundColor: "background.paper" }}
								>
									<AccordionSummary
										expandIcon={
											<ExpandMoreIcon
												sx={{ color: "accent.main" }}
											/>
										}
										sx={{ px: { xs: 2, sm: 3 }, py: 0.75 }}
									>
										<Typography
											variant="h6"
											component="h3"
											sx={{
												fontSize: {
													xs: "1rem",
													sm: "1.1rem",
												},
											}}
										>
											{faq.question}
										</Typography>
									</AccordionSummary>
									<AccordionDetails
										sx={{ px: { xs: 2, sm: 3 }, pb: 3 }}
									>
										<Typography
											sx={{
												color: "text.secondary",
												lineHeight: 1.7,
												maxWidth: "70ch",
											}}
										>
											{faq.answer}
										</Typography>
									</AccordionDetails>
								</Accordion>
							</motion.div>
						))}
					</Box>
				</motion.div>
			</Container>
		</Box>
	);
};

export default FaqSection;
