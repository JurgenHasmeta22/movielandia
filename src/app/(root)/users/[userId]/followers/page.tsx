import { getFollowers } from "@/actions/user/userFollow.actions";
import { getUserById } from "@/actions/user/user.actions";
import { notFound, redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";
import { Suspense } from "react";
import FollowersContent from "../[userName]/followers/_components/FollowersContent";

interface IFollowersPageProps {
    params: {
        userId: string;
        userName: string;
    };
    searchParams?: Promise<{ page?: string }>;
}

export default async function FollowersPage(props: IFollowersPageProps) {
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

    const followers = await getFollowers(Number(params.userId), page);

    return (
        <Suspense key={searchParamsKey} fallback={<LoadingSpinner />}>
            <FollowersContent userInPage={userInPage} userLoggedIn={userSession} followers={followers} />
        </Suspense>
    );
}
