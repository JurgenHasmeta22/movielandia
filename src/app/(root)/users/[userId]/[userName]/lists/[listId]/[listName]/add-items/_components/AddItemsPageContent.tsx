"use client";

import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getUserFavorites } from "@/actions/user/userProfile.actions";
import AddItemsForm from "./AddItemsForm";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";

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
}

export default function AddItemsPageContent({ params, searchParams, session }: AddItemsPageContentProps) {
    const { userId, listId } = params;
    const page = Number(searchParams?.page) || 1;
    const type = searchParams?.type || "movies";
    const sortBy = searchParams?.sortBy || "createdAt";
    const ascOrDesc = searchParams?.ascOrDesc || "desc";

    const [bookmarkedItems, setBookmarkedItems] = useState<BookmarkedItem[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchItems() {
            try {
                setIsLoading(true);
                const data = await getUserFavorites(
                    Number(userId),
                    type.toLowerCase() as any,
                    page
                );
                
                setBookmarkedItems(data.items || []);
                setTotalItems(data.total || 0);
            } catch (error) {
                console.error("Error fetching items:", error);
                setBookmarkedItems([]);
                setTotalItems(0);
            } finally {
                setIsLoading(false);
            }
        }

        fetchItems();
    }, [userId, type, page]);

    const pageCount = Math.ceil(totalItems / 12);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
            <Typography variant="h4" sx={{ mb: 4 }}>
                Add Items to List
            </Typography>

            <AddItemsForm
                items={bookmarkedItems}
                totalPages={pageCount}
                currentPage={page}
                selectedType={type}
                listId={Number(listId)}
                userId={Number(userId)}
            />
        </Box>
    );
}
