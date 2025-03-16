"use client";

import { Box, Typography } from "@mui/material";
import AddItemsForm from "./AddItemsForm";

interface BookmarkedItem {
    id: number;
    title?: string;
    name?: string;
    fullname?: string;
    posterPath?: string | null;
    profilePath?: string | null;
}

interface AddItemsPageContentProps {
    params: {
        userId: string;
        listId: string;
    };
    searchParams?: {
        page?: string;
        type?: string;
        sortBy?: string;
        ascOrDesc?: string;
    };
    session: any;
    items: BookmarkedItem[];
    totalPages: number;
}

export default function AddItemsPageContent({ params, searchParams, items, totalPages }: AddItemsPageContentProps) {
    const { userId, listId } = params;
    const page = Number(searchParams?.page) || 1;

    return (
        <Box sx={{ maxWidth: 1200, mx: "auto", p: 3, mt: 8, mb: 6 }}>
            <Typography variant="h4" sx={{ mb: 4 }}>
                Add Items to List
            </Typography>
            <AddItemsForm
                items={items}
                totalPages={totalPages}
                currentPage={page}
                listId={Number(listId)}
                userId={Number(userId)}
            />
        </Box>
    );
}
