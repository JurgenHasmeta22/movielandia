import { getFollowers } from "@/actions/user/userFollow.actions";
import { getUserById } from "@/actions/user/user.actions";
import FollowersContent from "./_components/FollowersContent";
import { notFound } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";
import { Suspense } from "react";

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

    const followers = await getFollowers(Number(params.userId), page);

    return (
        <Suspense key={searchParamsKey} fallback={<LoadingSpinner />}>
            <FollowersContent userInPage={userInPage} userLoggedIn={userSession} followers={followers} />{" "}
        </Suspense>
    );
}
