import { Suspense } from "react";
import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { searchForumContent } from "@/actions/forum/forumSearch.actions";
import { getAllTags } from "@/actions/forum/forumTag.actions";
import { getCategoryById } from "@/actions/forum/forumCategory.actions";
import { TopicStatus } from "@prisma/client";
import SearchPageContent from "./_components/SearchPageContent";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";

interface ISearchPageProps {
    searchParams?: Promise<{
        q?: string;
        page?: string;
        categoryId?: string;
        userId?: string;
        tags?: string;
        status?: string;
        dateFrom?: string;
        dateTo?: string;
    }>;
}

export const metadata: Metadata = {
    title: "Search Forum | MovieLandia24",
    description: "Search for topics, posts, and replies in the MovieLandia24 forum.",
};

export default async function SearchPage(props: ISearchPageProps) {
    const session = await getServerSession(authOptions);

    const searchParams = await props.searchParams;
    const searchParamsKey = JSON.stringify(searchParams);

    const query = searchParams?.q || "";
    const currentPage = searchParams?.page ? parseInt(searchParams.page) : 1;
    const limit = 10;

    const filters: any = {};

    if (searchParams?.categoryId) {
        filters.categoryId = parseInt(searchParams.categoryId);
    }

    if (searchParams?.userId) {
        filters.userId = parseInt(searchParams.userId);
    }

    if (searchParams?.tags) {
        filters.tagIds = searchParams.tags.split(",").map((id) => parseInt(id));
    }

    if (searchParams?.status && searchParams.status !== "all") {
        filters.status = searchParams.status as TopicStatus;
    }

    if (searchParams?.dateFrom) {
        filters.dateFrom = new Date(searchParams.dateFrom);
    }

    if (searchParams?.dateTo) {
        filters.dateTo = new Date(searchParams.dateTo);
    }

    const searchResults = query
        ? await searchForumContent(query, currentPage, limit, filters)
        : { topics: { items: [], total: 0 }, posts: { items: [], total: 0 }, replies: { items: [], total: 0 } };

    const allTags = await getAllTags();

    let category = null;

    if (searchParams?.categoryId) {
        category = await getCategoryById(parseInt(searchParams.categoryId));
    }

    return (
        <Suspense key={searchParamsKey} fallback={<LoadingSpinner />}>
            <SearchPageContent
                query={query}
                searchResults={searchResults}
                currentPage={currentPage}
                session={session}
                allTags={allTags}
                category={category}
                filters={filters}
            />
        </Suspense>
    );
}
