import { getFollowing } from "@/actions/user/userFollow.actions";
import { getUserById } from "@/actions/user/user.actions";
import FollowingContent from "./_components/FollowingContent";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { notFound } from "next/navigation";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";
import { Suspense } from "react";

interface IFollowingPageProps {
    params: {
        userId: string;
        userName: string;
    };
    searchParams?: Promise<{ page?: string }>;
}

export default async function FollowingPage(props: IFollowingPageProps) {
    const session = await getServerSession(authOptions);
    const userSession = session?.user
        ? {
              id: Number(session.user.id),
              userName: session.user.userName,
              email: session.user.email,
              password: null,
              role: session.user.role,
              bio: "",
              active: true,
              canResetPassword: false,
          }
        : null;

    const params = await props.params;
    const userInPage = await getUserById(Number(params.userId));

    const searchParams = await props.searchParams;
    const searchParamsKey = JSON.stringify(searchParams);
    const page = Number(searchParams?.page) || 1;

    try {
        if (!userInPage) {
            return notFound();
        }
    } catch (error) {
        return notFound();
    }

    const following = await getFollowing(Number(params.userId), page);

    return (
        <Suspense key={searchParamsKey} fallback={<LoadingSpinner />}>
            <FollowingContent userInPage={userInPage} userLoggedIn={userSession} following={following} />
        </Suspense>
    );
}
