import { Suspense } from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserFavorites } from "@/actions/user/userProfile.actions";
import AddItemsForm from "./_components/AddItemsForm";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";
import { Box, Typography } from "@mui/material";

interface PageProps {
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
}

async function fetchItems(type: string, userId: number, queryParams: any) {
    const page = Number(queryParams.page) || 1;
    const search = "";

    try {
        const data = await getUserFavorites(userId, type.toLowerCase() as any, page, search);
        
        return { 
            items: data.items || [], 
            total: data.total || 0 
        };
    } catch (error) {
        console.error("Error fetching items:", error);
        return { items: [], total: 0 };
    }
}

export default async function AddItemsPage({ params, searchParams }: PageProps) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const page = Number(searchParams?.page) || 1;
    const type = searchParams?.type || "movies";
    const sortBy = searchParams?.sortBy || "createdAt";
    const ascOrDesc = searchParams?.ascOrDesc || "desc";

    const queryParams = {
        page,
        sortBy,
        ascOrDesc,
        userId: Number(session.user.id)
    };

    const { items, total } = await fetchItems(type, Number(session.user.id), queryParams);
    const pageCount = Math.ceil(total / 12);

    return (
        <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
            <Typography variant="h4" sx={{ mb: 4 }}>
                Add Items to List
            </Typography>
            <Suspense fallback={<LoadingSpinner />}>
                <AddItemsForm
                    items={items}
                    totalPages={pageCount}
                    currentPage={page}
                    selectedType={type}
                    listId={Number(params.listId)}
                    userId={Number(params.userId)}
                />
            </Suspense>
        </Box>
    );
}
