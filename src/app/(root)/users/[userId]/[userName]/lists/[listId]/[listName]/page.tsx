import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
    getListById,
    getListMovies,
    getListSeries,
    getListActors,
    getListCrew,
    getListSeasons,
    getListEpisodes,
} from "@/actions/list/list.actions";
import ListPageContent from "./_components/ListPageContent";
import { notFound } from "next/navigation";

interface PageProps {
    params: {
        userId: string;
        userName: string;
        listId: string;
        listSlug: string;
    };
    searchParams: {
        tab?: string;
        page?: string;
    };
}

export default async function Page({ params, searchParams }: PageProps) {
    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id ? Number(session.user.id) : 0;

    const userId = Number(params.userId);
    const listId = Number(params.listId);
    const page = Number(searchParams.page) || 1;
    const tab = searchParams.tab || "movies";
    const itemsPerPage = 12;

    const list = await getListById(listId, userId);

    if (!list) {
        notFound();
    }

    let content: any;
    let totalItems = 0;

    switch (tab) {
        case "movies": {
            const { items, total } = await getListMovies(listId, currentUserId, page, itemsPerPage);
            content = items;
            totalItems = total;
            break;
        }

        case "series": {
            const { items, total } = await getListSeries(listId, currentUserId, page, itemsPerPage);
            content = items;
            totalItems = total;
            break;
        }

        case "seasons": {
            const { items, total } = await getListSeasons(listId, currentUserId, page, itemsPerPage);
            content = items;
            totalItems = total;
            break;
        }

        case "episodes": {
            const { items, total } = await getListEpisodes(listId, currentUserId, page, itemsPerPage);
            content = items;
            totalItems = total;
            break;
        }

        case "actors": {
            const { items, total } = await getListActors(listId, currentUserId, page, itemsPerPage);
            content = items;
            totalItems = total;
            break;
        }

        case "crew": {
            const { items, total } = await getListCrew(listId, currentUserId, page, itemsPerPage);
            content = items;
            totalItems = total;
            break;
        }
    }

    return (
        <ListPageContent
            list={list}
            userName={params.userName}
            currentUserId={currentUserId}
            content={content}
            totalItems={totalItems}
            currentTab={tab}
            currentPage={page}
        />
    );
}
