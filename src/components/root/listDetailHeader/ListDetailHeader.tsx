"use client";

import { Box, Button, Typography, Stack } from "@mui/material";
import { DeleteForever, DeleteSweep, Edit } from "@mui/icons-material";
import { useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { showToast } from "@/utils/helpers/toast";
import {
	deleteList,
	getListContentType,
	getListById,
} from "@/actions/list/list.actions";
import { removeAllItemsFromList } from "@/actions/list/listItems.actions";
import ContentTypeLabel from "../contentTypeLabel/ContentTypeLabel";
import { useEffect, useState } from "react";
import EditListModal from "@/app/(root)/users/[userId]/[userName]/lists/[listId]/[listName]/_components/EditListModal";

interface ListDetailHeaderProps {
	listId: number;
	userId: number;
	listTitle: string;
	currentUserId?: number;
	totalItems: number;
}

export default function ListDetailHeader({
	listId,
	userId,
	listTitle,
	currentUserId,
	totalItems,
}: ListDetailHeaderProps) {
	const router = useRouter();
	const pathname = usePathname();
	const [isPending, startTransition] = useTransition();
	const [contentType, setContentType] = useState<any>(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [listDetails, setListDetails] = useState<{
		name: string;
		description: string;
		isPrivate: boolean;
	} | null>(null);

	useEffect(() => {
		const fetchContentType = async () => {
			try {
				const type = await getListContentType(listId);
				setContentType(type);
			} catch (error) {
				console.error("Failed to fetch content type:", error);
			}
		};

		fetchContentType();
	}, [listId]);

	const handleOpenEditModal = async () => {
		try {
			const list = await getListById(listId);

			if (list) {
				setListDetails({
					name: list.name,
					description: list.description || "",
					isPrivate: list.isPrivate,
				});

				setIsEditModalOpen(true);
			}
		} catch (error) {
			showToast("error", "Failed to load list details");
			console.error("Failed to load list details:", error);
		}
	};

	const handleDeleteAllItems = () => {
		if (totalItems === 0) {
			showToast("info", "There are no items in this list");
			return;
		}

		startTransition(async () => {
			try {
				await removeAllItemsFromList(listId, userId);
				showToast("success", "All items removed from list");
				router.refresh();
			} catch (error) {
				showToast(
					"error",
					error instanceof Error
						? error.message
						: "Failed to remove items",
				);
			}
		});
	};

	const handleDeleteList = () => {
		startTransition(async () => {
			try {
				await deleteList(listId, userId);

				const pathParts = pathname.split("/");
				const userIdIndex = pathParts.findIndex(
					(part) => part === userId.toString(),
				);
				const userName =
					userIdIndex >= 0 && userIdIndex + 1 < pathParts.length
						? pathParts[userIdIndex + 1]
						: "user";

				showToast("success", "List deleted successfully");
				router.push(`/users/${userId}/${userName}/lists`);
				router.refresh();
			} catch (error) {
				showToast(
					"error",
					error instanceof Error
						? error.message
						: "Failed to delete list",
				);
			}
		});
	};

	return (
		<>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					mb: 4,
				}}
			>
				<Stack direction="row" spacing={2} alignItems="center">
					<Typography
						variant="h1"
						sx={{ fontSize: "1.5rem", fontWeight: 500 }}
					>
						{listTitle}
					</Typography>
					{contentType && (
						<ContentTypeLabel
							contentType={contentType}
							size="medium"
						/>
					)}
				</Stack>
				<Stack direction="row" spacing={1}>
					{currentUserId === userId && (
						<Button
							variant="outlined"
							color="primary"
							startIcon={<Edit />}
							onClick={handleOpenEditModal}
							disabled={isPending}
							sx={{ textTransform: "none" }}
						>
							Edit List
						</Button>
					)}
					<Button
						variant="outlined"
						color="error"
						startIcon={<DeleteSweep />}
						onClick={handleDeleteAllItems}
						disabled={isPending}
						sx={{ textTransform: "none" }}
					>
						Delete All Items
					</Button>
					<Button
						variant="outlined"
						color="error"
						startIcon={<DeleteForever />}
						onClick={handleDeleteList}
						disabled={isPending}
						sx={{ textTransform: "none" }}
					>
						Delete List
					</Button>
				</Stack>
			</Box>
			{isEditModalOpen && listDetails && (
				<EditListModal
					open={isEditModalOpen}
					onClose={() => setIsEditModalOpen(false)}
					listId={listId}
					userId={userId}
					initialValues={{
						name: listDetails.name,
						description: listDetails.description,
						isPrivate: listDetails.isPrivate,
					}}
				/>
			)}
		</>
	);
}
