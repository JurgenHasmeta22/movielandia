import { Suspense } from "react";
import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getTopicById } from "@/actions/forum/forumTopic.actions";
import { getCategoryById } from "@/actions/forum/forumCategory.actions";
import { getPostsByTopicId } from "@/actions/forum/forumPost.actions";
import { getRepliesByPostId } from "@/actions/forum/forumReply.actions";
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
        [key: string]: string | undefined;
    }>;
}

export async function generateMetadata(props: ITopicPageProps): Promise<Metadata> {
    const params = props.params;
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
    const params = await props.params;
    const topic = await getTopicById(Number(params.topicId), true);

    if (!topic) {
        return notFound();
    }

    const category = await getCategoryById(Number(params.categoryId));

    if (!category) {
        return notFound();
    }

    if (topic.categoryId !== category.id) {
        return notFound();
    }

    const searchParams = await props.searchParams;
    const searchParamsKey = JSON.stringify(searchParams);

    const currentPage = searchParams?.page ? parseInt(searchParams.page) : 1;
    const limit = 10;

    const posts = await getPostsByTopicId(topic.id, currentPage, limit);

    const postsWithReplies = await Promise.all(
        posts.items.map(async (post) => {
            const replyPageParam = searchParams?.[`replyPage_${post.id}`];
            const replyPage = replyPageParam ? parseInt(replyPageParam) : 1;
            const replies = await getRepliesByPostId(post.id, replyPage, 5);
            
            return {
                ...post,
                replies: replies,
                replyPage: replyPage
            };
        })
    );

    const postsData = {
        items: postsWithReplies,
        total: posts.total
    };

    return (
        <Suspense key={searchParamsKey} fallback={<LoadingSpinner />}>
            <TopicPageContent
                topic={topic}
                category={category}
                searchParams={searchParams}
                session={session}
                posts={postsData}
                currentPage={currentPage}
            />
        </Suspense>
    );
}
