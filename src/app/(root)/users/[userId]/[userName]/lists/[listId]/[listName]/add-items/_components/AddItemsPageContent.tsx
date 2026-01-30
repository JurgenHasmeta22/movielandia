import { Box, Typography } from "@mui/material";
import AddItemsForm from "./AddItemsForm";
import {
	getUserFavorites,
	getAvailableItemsForList,
} from "@/actions/user/userProfile.actions";
import { getListById } from "@/actions/list/list.actions";
import { notFound } from "next/navigation";

interface AddItemsPageContentProps {
	params: {
		userId: string;
		listId: string;
		listName: string;
	};
	searchParams?: {
		page?: string;
		type?: string;
		sortBy?: string;
		ascOrDesc?: string;
	};
}

export default async function AddItemsPageContent({
	params,
	searchParams,
}: AddItemsPageContentProps) {
	const { userId, listId, listName } = params;

	const currentPage = searchParams?.page ? Number(searchParams.page) : 1;
	const type = searchParams?.type;

	let list;

	try {
		list = await getListById(Number(listId), Number(userId));
		if (!list) {
			return notFound();
		}
	} catch (error) {
		return notFound();
	}

	const initialContentType = list.contentType
		? `${list.contentType.toLowerCase()}s`
		: undefined;

	const effectiveType = type || initialContentType;

	let data: any = { items: [], total: 0 };
	let pageCount = 1;

	try {
		if (effectiveType) {
			if (initialContentType) {
				data = await getAvailableItemsForList(
					Number(userId),
					Number(listId),
					effectiveType.toLowerCase() as any,
					currentPage,
				);
			} else {
				data = await getUserFavorites(
					Number(userId),
					effectiveType.toLowerCase() as any,
					currentPage,
				);
			}
			pageCount = Math.ceil((data.total || 0) / 12);
		}
	} catch (error) {
		return notFound();
	}

	return (
		<Box sx={{ maxWidth: 1200, mx: "auto", p: 3, mt: 8, mb: 6 }}>
			<Typography variant="h4" sx={{ mb: 4 }}>
				Add Items to List
			</Typography>
			<AddItemsForm
				items={data.items}
				totalPages={pageCount}
				currentPage={currentPage}
				listId={Number(listId)}
				userId={Number(userId)}
				listName={listName}
				initialContentType={initialContentType}
			/>
		</Box>
	);
}
