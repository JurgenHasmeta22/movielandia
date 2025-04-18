import { getTopicById } from "@/actions/forum/forumTopic.actions";
import { redirect } from "next/navigation";

interface ITopicPageProps {
    params: {
        topicId: string;
        topicSlug: string;
    };
    searchParams?: Promise<{
        page?: string;
    }>;
}

export default async function TopicRedirectPage(props: ITopicPageProps) {
    const topic = await getTopicById(Number(props.params.topicId));

    // Redirect to the new URL structure
    redirect(`/forum/categories/${topic.categoryId}/${topic.category.slug}/topics/${topic.id}/${topic.slug}`);
}
