"use client";

import { useState, useTransition } from "react";
import {
	Box,
	CircularProgress,
	IconButton,
	Stack,
	Typography,
	Container,
	Paper,
	Avatar,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {
	acceptFollowRequest,
	refuseFollowRequest,
} from "@/actions/user/userFollow.actions";
import { showToast } from "@/utils/helpers/toast";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Link from "next/link";

interface FollowersRequestsPageContentProps {
	pendingFollowers: any;
	userLoggedInId: number;
	userLoggedInUsername: string;
}

export default function FollowersRequestsPageContent({
	pendingFollowers,
	userLoggedInId,
	userLoggedInUsername,
}: FollowersRequestsPageContentProps) {
	return (
		<Container maxWidth="md" sx={{ py: 4, mt: 8, mb: 8 }}>
			<Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
				Follow Requests
			</Typography>
			{pendingFollowers.items.length === 0 ? (
				<Box
					sx={{
						py: 8,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						gap: 2,
					}}
				>
					<PersonAddIcon
						sx={{
							fontSize: 64,
							color: "text.disabled",
						}}
					/>
					<Typography
						variant="h6"
						color="text.secondary"
						align="center"
					>
						No pending follow requests.
					</Typography>
				</Box>
			) : (
				<Stack spacing={2}>
					{pendingFollowers.items.map(
						(follow: any, index: number) => (
							<motion.div
								key={follow.follower.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{
									opacity: 1,
									y: 0,
									transition: { delay: index * 0.1 },
								}}
							>
								<Paper
									sx={{
										p: 2,
										bgcolor: "background.paper",
										transition: "all 0.2s",
										"&:hover": {
											transform: "translateY(-2px)",
											boxShadow: (theme) =>
												theme.shadows[4],
										},
									}}
									elevation={1}
								>
									<FollowRequestItem
										follow={follow}
										userLoggedInId={userLoggedInId}
										userId={Number(follow.follower.id)}
										userName={follow.follower.userName}
									/>
								</Paper>
							</motion.div>
						),
					)}
				</Stack>
			)}
		</Container>
	);
}

interface FollowRequestItemProps {
	follow: any;
	userLoggedInId: number | undefined;
	userId: number;
	userName: string;
}

function FollowRequestItem({
	follow,
	userLoggedInId,
	userId,
	userName,
}: FollowRequestItemProps) {
	const [isPending, startTransition] = useTransition();
	const [pendingActionId, setPendingActionId] = useState<number | null>(null);
	const router = useRouter();

	const handleAcceptFollow = async (followerId: number) => {
		if (!userLoggedInId || isPending) return;

		setPendingActionId(followerId);

		startTransition(async () => {
			try {
				await acceptFollowRequest(followerId, Number(userLoggedInId));
				showToast("success", "Follow request accepted!");
				router.refresh();
			} catch (error: any) {
				console.error(
					`Error accepting follow request: ${error.message}`,
				);
				showToast(
					"error",
					error.message || "Error accepting follow request",
				);
			} finally {
				setPendingActionId(null);
			}
		});
	};

	const handleRefuseFollow = async (followerId: number) => {
		if (!userLoggedInId || isPending) return;

		setPendingActionId(followerId);

		startTransition(async () => {
			try {
				await refuseFollowRequest(followerId, Number(userLoggedInId));
				showToast("success", "Follow request succesfully refused!");
				router.refresh();
			} catch (error: any) {
				console.error(
					`Error refusing follow request: ${error.message}`,
				);
				showToast(
					"error",
					error.message || "Error refusing follow request",
				);
			} finally {
				setPendingActionId(null);
			}
		});
	};

	return (
		<Stack direction="row" spacing={2} alignItems="center">
			<Avatar
				src={follow.follower.avatar?.photoSrc}
				alt={follow.follower.userName}
				sx={{ width: 50, height: 50 }}
			/>
			<Box sx={{ flex: 1 }}>
				<Link
					href={`/users/${userId}/${userName}`}
					passHref
					style={{ textDecoration: "none" }}
				>
					<Typography
						variant="body1"
						sx={{
							fontWeight: 500,
							color: "inherit",
							"&:hover": { textDecoration: "underline" },
						}}
					>
						{follow.follower.userName}
					</Typography>
				</Link>
				<Typography
					variant="body2"
					color="text.secondary"
					sx={{ mt: 0.5 }}
				>
					wants to follow you
				</Typography>
			</Box>
			<Box>
				<IconButton
					onClick={() => handleAcceptFollow(follow.follower.id)}
					disabled={isPending}
					size="small"
					sx={{
						color: "success.main",
						"&:hover": {
							color: "success.dark",
							transform: "scale(1.1)",
						},
					}}
				>
					{isPending && pendingActionId === follow.follower.id ? (
						<CircularProgress size={16} color="inherit" />
					) : (
						<CheckIcon fontSize="small" />
					)}
				</IconButton>
				<IconButton
					onClick={() => handleRefuseFollow(follow.follower.id)}
					disabled={isPending}
					size="small"
					sx={{
						color: "error.main",
						"&:hover": {
							color: "error.dark",
							transform: "scale(1.1)",
						},
					}}
				>
					{isPending && pendingActionId === follow.follower.id ? (
						<CircularProgress size={16} color="inherit" />
					) : (
						<CloseIcon fontSize="small" />
					)}
				</IconButton>
			</Box>
		</Stack>
	);
}
