import { getFollowing } from "@/actions/user/userFollow.actions";
import { getUserById } from "@/actions/user/user.actions";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { notFound, redirect } from "next/navigation";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";
import { Suspense } from "react";
import FollowingContent from "../[userName]/following/_components/FollowingContent";

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
    const userInPage: any = await getUserById(Number(params.userId), userSession?.id);

    if (!userInPage) {
        return notFound();
    }

    const canViewProfile =
        userSession?.id === userInPage.id || (userInPage.isFollowed && userInPage.isFollowedStatus === "accepted");

    if (!canViewProfile) {
        return redirect(`/users/${params.userId}`);
    }

    const searchParams = await props.searchParams;
    const searchParamsKey = JSON.stringify(searchParams);
    const page = Number(searchParams?.page) || 1;

    const following = await getFollowing(Number(params.userId), page);

    return (
        <Suspense key={searchParamsKey} fallback={<LoadingSpinner />}>
            <FollowingContent userInPage={userInPage} userLoggedIn={userSession} following={following} />
        </Suspense>
    );
}
