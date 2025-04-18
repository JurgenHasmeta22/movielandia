import { Suspense } from "react";
import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getPostById } from "@/actions/forum/forumPost.actions";
import { redirect, notFound } from "next/navigation";
import EditPostPageContent from "./_components/EditPostPageContent";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";

interface IEditPostPageProps {
    params: {
        postId: string;
    };
}

export const metadata: Metadata = {
    title: "Edit Post | Forum | MovieLandia24",
    description: "Edit your forum post on MovieLandia24.",
    robots: {
        index: false,
        follow: false,
    },
};

export default async function EditPostPage(props: IEditPostPageProps) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/api/auth/signin?callbackUrl=/forum");
    }

    const post = await getPostById(Number(props.params.postId));

    if (!post) {
        return notFound();
    }

    if (post.userId !== Number(session.user.id)) {
        redirect(`/forum/topics/${post.topicId}`);
    }

    return (
        <Suspense fallback={<LoadingSpinner />}>
            <EditPostPageContent post={post} session={session} />
        </Suspense>
    );
}
