import { Suspense } from "react";
import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getCategoryById } from "@/actions/forum/forumCategory.actions";
import { getTopics } from "@/actions/forum/forumTopic.actions";
import { TopicStatus } from "@prisma/client";
import { notFound } from "next/navigation";
import CategoryPageContent from "./_components/CategoryPageContent";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";

interface ICategoryPageProps {
    params: {
        categoryId: string;
        categorySlug: string;
    };
    searchParams?: Promise<{
        page?: string;
        topicsSortBy?: string;
        topicsAscOrDesc?: string;
        tags?: string;
        status?: string;
    }>;
}

export async function generateMetadata({ params }: ICategoryPageProps): Promise<Metadata> {
    const category = await getCategoryById(Number(params.categoryId));

    if (!category) {
        return {
            title: "Category Not Found | MovieLandia24",
            description: "The requested forum category could not be found.",
        };
    }

    return {
        title: `${category.name} | Forum | MovieLandia24`,
        description: category.description,
        openGraph: {
            title: `${category.name} | Forum | MovieLandia24`,
            description: category.description,
            url: `/forum/categories/${category.id}/${category.slug}`,
            siteName: "MovieLandia24",
            locale: "en_US",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            site: "@movieLandia24",
            creator: "movieLandia24",
            title: `${category.name} | Forum | MovieLandia24`,
            description: category.description,
        },
    };
}

export default async function CategoryPage(props: ICategoryPageProps) {
    const session = await getServerSession(authOptions);
    const params = await props.params;
    const category = await getCategoryById(Number(params.categoryId));

    if (!category) {
        return notFound();
    }

    const searchParams = await props.searchParams;
    const searchParamsKey = JSON.stringify(searchParams);

    const currentPage = searchParams?.page ? parseInt(searchParams.page) : 1;
    const currentSortBy = searchParams?.topicsSortBy ?? "";
    const currentOrder = searchParams?.topicsAscOrDesc ?? "";
    const limit = 10;

    let tagIds: number[] | undefined;

    if (searchParams?.tags) {
        tagIds = searchParams.tags.split(",").map((id) => parseInt(id));
    }

    let status: TopicStatus | undefined;

    if (searchParams?.status && searchParams.status !== "all") {
        if (["Open", "Closed", "Archived"].includes(searchParams.status)) {
            status = searchParams.status as TopicStatus;
            console.log(`Using status filter: ${status}`);
        } else {
            console.warn(`Invalid status value received: ${searchParams.status}`);
        }
    }

    const topics = await getTopics({
        categoryId: category.id,
        page: currentPage,
        limit,
        tagIds,
        status,
        topicsSortBy: searchParams?.topicsSortBy,
        topicsAscOrDesc: searchParams?.topicsAscOrDesc,
    });

    return (
        <Suspense key={searchParamsKey} fallback={<LoadingSpinner />}>
            <CategoryPageContent
                category={category}
                session={session}
                topics={topics}
                currentPage={currentPage}
                currentSortBy={currentSortBy}
                currentOrder={currentOrder}
            />
        </Suspense>
    );
}
