import { Box, Typography } from "@mui/material";
import AddItemsForm from "./AddItemsForm";
import { getUserFavorites } from "@/actions/user/userProfile.actions";
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

export default async function AddItemsPageContent({ params, searchParams }: AddItemsPageContentProps) {
    const { userId, listId, listName } = params;

    const currentPage = searchParams?.page ? Number(searchParams.page) : 1;
    const type = searchParams?.type;

    let data: any = { items: [], total: 0 };
    let pageCount = 1;

    try {
        if (type) {
            data = await getUserFavorites(Number(userId), type.toLowerCase() as any, currentPage);
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
            />
        </Box>
    );
}
