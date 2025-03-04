import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
    getPlaylistById,
    getPlaylistMovies,
    getPlaylistSeries,
    getPlaylistActors,
    getPlaylistCrew,
    getPlaylistSeasons,
    getPlaylistEpisodes,
} from "@/actions/playlist/playlist.actions";
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

    const playlist = await getPlaylistById(listId, userId);

    if (!playlist) {
        notFound();
    }

    let content: any;
    let totalItems = 0;

    switch (tab) {
        case "movies": {
            const { items, total } = await getPlaylistMovies(listId, currentUserId, page, itemsPerPage);
            content = items;
            totalItems = total;
            break;
        }
        
        case "series": {
            const { items, total } = await getPlaylistSeries(listId, currentUserId, page, itemsPerPage);
            content = items;
            totalItems = total;
            break;
        }

        case "seasons": {
            const { items, total } = await getPlaylistSeasons(listId, currentUserId, page, itemsPerPage);
            content = items;
            totalItems = total;
            break;
        }

        case "episodes": {
            const { items, total } = await getPlaylistEpisodes(listId, currentUserId, page, itemsPerPage);
            content = items;
            totalItems = total;
            break;
        }

        case "actors": {
            const { items, total } = await getPlaylistActors(listId, currentUserId, page, itemsPerPage);
            content = items;
            totalItems = total;
            break;
        }

        case "crew": {
            const { items, total } = await getPlaylistCrew(listId, currentUserId, page, itemsPerPage);
            content = items;
            totalItems = total;
            break;
        }
    }

    return (
        <ListPageContent
            playlist={playlist}
            userName={params.userName}
            currentUserId={currentUserId}
            content={content}
            totalItems={totalItems}
            currentTab={tab}
            currentPage={page}
        />
    );
}
