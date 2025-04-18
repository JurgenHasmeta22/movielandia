import { Suspense } from "react";
import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getTopicById } from "@/actions/forum/forumTopic.actions";
import { getCategoryById } from "@/actions/forum/forumCategory.actions";
import { getPostsByTopicId } from "@/actions/forum/forumPost.actions";
import { notFound } from "next/navigation";
import TopicPageContent from "./_components/TopicPageContent";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";

interface ITopicPageProps {
    params: {
        categoryId: string;
        categorySlug: string;
        topicId: string;
        topicSlug: string;
    };
    searchParams?: Promise<{
        page?: string;
    }>;
}

export async function generateMetadata({ params }: ITopicPageProps): Promise<Metadata> {
    const topic = await getTopicById(Number(params.topicId));

    if (!topic) {
        return {
            title: "Topic Not Found | MovieLandia24",
            description: "The requested forum topic could not be found.",
        };
    }

    const category = await getCategoryById(Number(params.categoryId));

    if (!category) {
        return {
            title: "Category Not Found | MovieLandia24",
            description: "The requested forum category could not be found.",
        };
    }

    return {
        title: `${topic.title} | ${category.name} | Forum | MovieLandia24`,
        description: topic.content.substring(0, 160),
        openGraph: {
            title: `${topic.title} | ${category.name} | Forum | MovieLandia24`,
            description: topic.content.substring(0, 160),
            url: `/forum/categories/${category.id}/${category.slug}/topics/${topic.id}/${topic.slug}`,
            siteName: "MovieLandia24",
            locale: "en_US",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            site: "@movieLandia24",
            creator: "movieLandia24",
            title: `${topic.title} | ${category.name} | Forum | MovieLandia24`,
            description: topic.content.substring(0, 160),
        },
    };
}

export default async function TopicPage(props: ITopicPageProps) {
    const session = await getServerSession(authOptions);
    const topic = await getTopicById(Number(props.params.topicId), true);

    if (!topic) {
        return notFound();
    }

    const category = await getCategoryById(Number(props.params.categoryId));

    if (!category) {
        return notFound();
    }

    // Verify that the topic belongs to the specified category
    if (topic.categoryId !== category.id) {
        return notFound();
    }

    const searchParams = await props.searchParams;
    const searchParamsKey = JSON.stringify(searchParams);

    const currentPage = searchParams?.page ? parseInt(searchParams.page) : 1;
    const limit = 10;

    // Fetch posts in the server component
    const posts = await getPostsByTopicId(topic.id, currentPage, limit);

    return (
        <Suspense key={searchParamsKey} fallback={<LoadingSpinner />}>
            <TopicPageContent
                topic={topic}
                category={category}
                searchParams={searchParams}
                session={session}
                posts={posts}
                currentPage={currentPage}
            />
        </Suspense>
    );
}
