import AddItemsPageContent from "./_components/AddItemsPageContent";
import { Suspense } from "react";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";

interface PageProps {
    params: {
        userId: string;
        listId: string;
        listName: string;
    };
    searchParams?: {
        page?: string;
        type?: string;
    };
}

export default async function AddItemsPage(props: PageProps) {
    const params = await props.params;
    const searchParams = await props.searchParams;
    const searchParamsKey = JSON.stringify(searchParams);

    return (
        <Suspense key={searchParamsKey} fallback={<LoadingSpinner />}>
            <AddItemsPageContent params={params} searchParams={searchParams} />
        </Suspense>
    );
}
