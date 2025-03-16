import { Metadata } from "next";
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserPlaylists } from "@/actions/list/list.actions";
import ListsPageContent from "./_components/ListsPageContent";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";

export const metadata: Metadata = {
    title: "Lists | MovieLandia24",
    description: "Browse and manage your movie and TV show lists",
};

interface PageProps {
    params: Promise<{
        userId: string;
        userName: string;
    }>;
    searchParams?: Promise<{
        listsAscOrDesc?: string;
        pageLists?: string;
        listsSortBy?: string;
        listsType?: string;
    }>;
}

export default async function ListsPage(props: PageProps) {
    const session = await getServerSession(authOptions);

    const searchParams = await props.searchParams;
    const searchParamsKey = JSON.stringify(searchParams);

    const params = await props.params;
    const userId = Number(params.userId);

    const { ascOrDesc, page, sortBy, type } = {
        ascOrDesc: searchParams?.listsAscOrDesc ?? "desc",
        page: searchParams?.pageLists ? Number(searchParams.pageLists) : 1,
        sortBy: searchParams?.listsSortBy ?? "createdAt",
        type: searchParams?.listsType,
    };

    const itemsPerPage = 12;

    let lists: any;
    let listsCount;

    try {
        const result = await getUserPlaylists(userId, {
            page,
            perPage: itemsPerPage,
            sortBy,
            ascOrDesc,
            type: type as any,
        });

        lists = result.items;
        listsCount = result.total;
    } catch (error) {
        lists = [];
        listsCount = 0;
    }

    return (
        <Suspense key={searchParamsKey} fallback={<LoadingSpinner />}>
            <ListsPageContent
                lists={lists}
                listsCount={listsCount}
                itemsPerPage={itemsPerPage}
                currentPage={page}
                searchParams={searchParams}
                session={session}
                userId={userId}
                userName={params.userName}
            />
        </Suspense>
    );
}
