"use client";

import {
	Avatar,
	Box,
	Card,
	CardContent,
	Rating,
	Stack,
	Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface ReviewItemProfileProps {
	review: any;
	type: any;
	variant?: "upvote" | "downvote";
	userLoggedIn: {
		id: number;
		userName: string;
		email: string;
		password: string | null;
		role: string;
		bio: string;
		active: boolean;
		canResetPassword: boolean;
	} | null;
}

export default function ReviewItemProfile({
	review,
	type,
	userLoggedIn,
}: ReviewItemProfileProps) {
	const getContentInfo = () => {
		switch (type) {
			case "movie":
				return {
					title: review.movie.title,
					link: `/movies/${review.movie.id}/${review.movie.title.toLowerCase().replace(/\s+/g, "-")}`,
				};
			case "serie":
				return {
					title: review.serie.title,
					link: `/series/${review.serie.id}/${review.serie.title.toLowerCase().replace(/\s+/g, "-")}`,
				};
			case "season":
				return {
					title: review.season.title,
					link: `/seasons/${review.season.id}/${review.season.title.toLowerCase().replace(/\s+/g, "-")}`,
				};
			case "episode":
				return {
					title: review.episode.title,
					link: `/episodes/${review.episode.id}/${review.episode.title.toLowerCase().replace(/\s+/g, "-")}`,
				};
			default:
				return { title: "", link: "" };
		}
	};

	const { title, link } = getContentInfo();

	if (!title || !link) return null;

	const modules = {
		toolbar: false,
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.2 }}
		>
			<Card
				elevation={0}
				sx={{
					backgroundColor: "background.paper",
					borderRadius: 2,
					overflow: "hidden",
					transition: "transform 0.2s ease-in-out",
					"&:hover": {
						transform: "translateY(-4px)",
					},
					width: "100%",
					maxWidth: "800px",
					cursor: "pointer",
				}}
			>
				<CardContent>
					<Stack spacing={2}>
						<Link href={link} style={{ textDecoration: "none" }}>
							<Typography
								variant="h6"
								sx={{
									color: "primary.main",
									"&:hover": { textDecoration: "underline" },
								}}
							>
								{title}
							</Typography>
						</Link>
						<Box
							sx={{
								"& .quill": {
									border: "none",
									"& .ql-container": {
										border: "none",
									},
									"& .ql-editor": {
										padding: 0,
										"& p": {
											color: "text.secondary",
										},
									},
								},
							}}
						>
							<ReactQuill
								value={review.content}
								readOnly={true}
								modules={modules}
								theme="snow"
							/>
						</Box>
						<Stack
							direction="row"
							spacing={2}
							alignItems="center"
							sx={{
								width: "100%",
								justifyContent: "space-between",
								flexWrap: "wrap",
								gap: 2,
							}}
						>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 1,
								}}
							>
								<Rating
									value={review.rating}
									max={10}
									readOnly
									precision={0.5}
									sx={{
										"& .MuiRating-icon": {
											fontSize: "1.2rem",
										},
									}}
								/>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									{review.rating.toFixed(1)}/10
								</Typography>
							</Box>
							<Stack direction="row" spacing={2}>
								<Stack
									direction="row"
									spacing={0.5}
									alignItems="center"
								>
									<ThumbUpIcon
										sx={{
											fontSize: "1.2rem",
											color: "success.main",
										}}
									/>
									<Typography
										variant="body2"
										color="text.secondary"
									>
										{review._count?.upvotes || 0}
									</Typography>
								</Stack>
								<Stack
									direction="row"
									spacing={0.5}
									alignItems="center"
								>
									<ThumbDownIcon
										sx={{
											fontSize: "1.2rem",
											color: "error.main",
										}}
									/>
									<Typography
										variant="body2"
										color="text.secondary"
									>
										{review._count?.downvotes || 0}
									</Typography>
								</Stack>
							</Stack>
						</Stack>
						<Stack
							direction="row"
							spacing={1}
							alignItems="center"
							sx={{ color: "text.secondary" }}
						>
							<Avatar
								src={
									review.user?.avatar?.photoSrc ||
									"/default-avatar.jpg"
								}
								alt={review.user?.userName || "User"}
								sx={{ width: 24, height: 24 }}
							/>
							<Stack
								direction="row"
								spacing={0.5}
								alignItems="center"
							>
								<Typography variant="body2">
									{review.user?.userName || "Anonymous"}
								</Typography>
								{userLoggedIn?.id === review.userId && (
									<Typography
										variant="body2"
										sx={{
											color: "#2ecc71",
											fontWeight: "bold",
											backgroundColor:
												"rgba(46, 204, 113, 0.1)",
											px: 0.8,
											py: 0.2,
											borderRadius: 1,
										}}
									>
										(You)
									</Typography>
								)}
							</Stack>
							<Typography variant="body2">
								{formatDistanceToNow(
									new Date(review.createdAt),
									{
										addSuffix: true,
									},
								)}
							</Typography>
						</Stack>
					</Stack>
				</CardContent>
			</Card>
		</motion.div>
	);
}
