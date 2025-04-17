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
    detectAndUpdateListContentType,
} from "@/actions/list/list.actions";
import ListPageContent from "./_components/ListPageContent";
import { notFound } from "next/navigation";

interface PageProps {
    params: {
        userId: string;
        userName: string;
        listId: string;
        listName: string;
    };
    searchParams: {
        tab?: string;
        page?: string;
    };
}

export default async function Page(props: PageProps) {
    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id ? Number(session.user.id) : 0;

    const params = await props.params;
    const searchParams = await props.searchParams;

    const userId = Number(params.userId);
    const listId = Number(params.listId);

    const page = Number(searchParams.page) || 1;
    const itemsPerPage = 12;

    const list = await getListById(listId, userId);

    if (!list) {
        notFound();
    }

    let content: any[] = [];
    let totalItems = 0;

    // Determine the content type and fetch the appropriate items
    if (list.contentType) {
        switch (list.contentType) {
            case "movie": {
                const { items, total } = await getListMovies(listId, currentUserId, page, itemsPerPage);
                content = items;
                totalItems = total;
                break;
            }

            case "serie": {
                const { items, total } = await getListSeries(listId, currentUserId, page, itemsPerPage);
                content = items;
                totalItems = total;
                break;
            }

            case "season": {
                const { items, total } = await getListSeasons(listId, currentUserId, page, itemsPerPage);
                content = items;
                totalItems = total;
                break;
            }

            case "episode": {
                const { items, total } = await getListEpisodes(listId, currentUserId, page, itemsPerPage);
                content = items;
                totalItems = total;
                break;
            }

            case "actor": {
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
    } else {
        // If the list doesn't have a content type, try to determine it by checking all content types
        // and update the list's content type using the server action
        const detectedType = await detectAndUpdateListContentType(listId, currentUserId);

        if (detectedType) {
            // Update the list object with the detected content type
            list.contentType = detectedType;

            // Fetch the items based on the detected content type
            switch (detectedType) {
                case "movie": {
                    const { items, total } = await getListMovies(listId, currentUserId, page, itemsPerPage);
                    content = items;
                    totalItems = total;
                    break;
                }
                case "serie": {
                    const { items, total } = await getListSeries(listId, currentUserId, page, itemsPerPage);
                    content = items;
                    totalItems = total;
                    break;
                }
                case "season": {
                    const { items, total } = await getListSeasons(listId, currentUserId, page, itemsPerPage);
                    content = items;
                    totalItems = total;
                    break;
                }
                case "episode": {
                    const { items, total } = await getListEpisodes(listId, currentUserId, page, itemsPerPage);
                    content = items;
                    totalItems = total;
                    break;
                }
                case "actor": {
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
        }
    }

    return (
        <ListPageContent
            list={list}
            userName={params.userName}
            currentUserId={currentUserId}
            content={content}
            totalItems={totalItems}
            currentPage={page}
        />
    );
}
