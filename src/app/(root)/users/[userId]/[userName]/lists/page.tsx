import { Metadata } from "next";
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserLists } from "@/actions/list/list.actions";
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
        listsView?: string;
    }>;
}

export default async function ListsPage(props: PageProps) {
    const session = await getServerSession(authOptions);

    const searchParams = await props.searchParams;
    const searchParamsKey = JSON.stringify(searchParams);

    const params = await props.params;
    const userId = Number(params.userId);

    const { ascOrDesc, page, sortBy, type, view } = {
        ascOrDesc: searchParams?.listsAscOrDesc ?? "desc",
        page: searchParams?.pageLists ? Number(searchParams.pageLists) : 1,
        sortBy: searchParams?.listsSortBy ?? "createdAt",
        type: searchParams?.listsType,
        view: searchParams?.listsView,
    };

    const itemsPerPage = 12;

    let lists: any;
    let listsCount;
    let sharedLists: any = [];
    let sharedListsCount = 0;

    const isOwnProfile = session?.user?.id && Number(session.user.id) === userId;

    try {
        // Get user's own lists
        const result = await getUserLists(userId, {
            page,
            perPage: itemsPerPage,
            sortBy,
            ascOrDesc,
        });

        lists = result.items;
        listsCount = result.total;

        // Get lists shared with the user (only if viewing own profile)
        if (isOwnProfile) {
            const sharedResult = await getUserLists(userId, {
                page,
                perPage: itemsPerPage,
                sortBy,
                ascOrDesc,
                sharedWithMe: true,
            });

            sharedLists = sharedResult.items;
            sharedListsCount = sharedResult.total;
        }
    } catch (error) {
        lists = [];
        listsCount = 0;
    }

    // Determine which lists to display based on the view parameter
    const displayLists = view === "shared" && isOwnProfile ? sharedLists : lists;
    const displayListsCount = view === "shared" && isOwnProfile ? sharedListsCount : listsCount;

    return (
        <Suspense key={searchParamsKey} fallback={<LoadingSpinner />}>
            <ListsPageContent
                lists={displayLists}
                listsCount={displayListsCount}
                itemsPerPage={itemsPerPage}
                currentPage={page}
                searchParams={searchParams}
                session={session}
                userId={userId}
                userName={params.userName}
                sharedLists={sharedLists}
                sharedListsCount={sharedListsCount}
                view={view}
            />
        </Suspense>
    );
}
