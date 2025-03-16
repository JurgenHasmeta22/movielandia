import { getUserFavorites } from "@/actions/user/userProfile.actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AddItemsPageContent from "./_components/AddItemsPageContent";
import { Suspense } from "react";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";

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

export default async function AddItemsPage({ params, searchParams }: PageProps) {
    const session = await getServerSession(authOptions);
    
    const page = Number(searchParams?.page) || 1;
    const type = searchParams?.type || "movies";

    const data = await getUserFavorites(
        Number(params.userId),
        type.toLowerCase() as any,
        page
    );

    const pageCount = Math.ceil((data.total || 0) / 12);

    return (
        <Suspense fallback={<LoadingSpinner />}>
            <AddItemsPageContent
                params={params}
                searchParams={searchParams}
                session={session}
                items={data.items || []}
                totalPages={pageCount}
            />
        </Suspense>
    );
}
