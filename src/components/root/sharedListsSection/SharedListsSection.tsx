"use client";

import { Box, Typography, Button, Stack, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { getRecentSharedLists } from "@/actions/list/listSharedWithMe.actions";
import ListCard from "../listCard/ListCard";
import { useRouter } from "next/navigation";
import ShareIcon from "@mui/icons-material/Share";

interface SharedListsSectionProps {
	userId: number;
	userName: string;
}

export default function SharedListsSection({
	userId,
	userName,
}: SharedListsSectionProps) {
	const [sharedLists, setSharedLists] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const fetchSharedLists = async () => {
			try {
				setIsLoading(true);
				const result = await getRecentSharedLists(userId, 3);
				if (result.success) {
					setSharedLists(result.items);
				}
			} catch (error) {
				console.error("Failed to fetch shared lists:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchSharedLists();
	}, [userId]);

	const handleViewAllClick = () => {
		router.push(`/users/${userId}/${userName}/lists?listsView=shared`);
	};

	if (isLoading) {
		return (
			<Box sx={{ mb: 4 }}>
				<Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
					Shared with me
				</Typography>
				<Stack
					direction="row"
					spacing={2}
					sx={{ overflowX: "auto", pb: 1 }}
				>
					{[1, 2, 3].map((i) => (
						<Skeleton
							key={i}
							variant="rectangular"
							width={280}
							height={180}
							sx={{ borderRadius: 1, flexShrink: 0 }}
						/>
					))}
				</Stack>
			</Box>
		);
	}

	if (sharedLists.length === 0) {
		return null;
	}

	return (
		<Box sx={{ mb: 4 }}>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					mb: 2,
				}}
			>
				<Typography variant="h5" sx={{ fontWeight: 600 }}>
					Shared with me
				</Typography>
				<Button
					variant="text"
					color="primary"
					onClick={handleViewAllClick}
					startIcon={<ShareIcon />}
					sx={{ textTransform: "none" }}
				>
					View all
				</Button>
			</Box>
			<Stack
				direction="row"
				spacing={2}
				sx={{
					overflowX: "auto",
					pb: 1,
					"&::-webkit-scrollbar": {
						height: 6,
					},
					"&::-webkit-scrollbar-track": {
						backgroundColor: "rgba(0,0,0,0.1)",
						borderRadius: 3,
					},
					"&::-webkit-scrollbar-thumb": {
						backgroundColor: "rgba(0,0,0,0.2)",
						borderRadius: 3,
					},
				}}
			>
				{sharedLists.map((list) => (
					<Box key={list.id} sx={{ flexShrink: 0 }}>
						<ListCard
							list={list}
							username={userName}
							userId={userId}
							isSharedView={true}
						/>
					</Box>
				))}
			</Stack>
		</Box>
	);
}
