import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { notFound } from "next/navigation";
import UserPageContent from "./_components/UserPageContent";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";
import { Suspense } from "react";
import { getUserById } from "@/actions/user/user.actions";
import { getFollowers, getFollowing, getPendingFollowRequests } from "@/actions/user/userFollow.actions";
import { getUserFavorites, getUserReviews, getUserVotes } from "@/actions/user/userProfile.actions";

interface IUserDetailsProps {
    params: {
        userId: string;
    };
    searchParams?: Promise<{ maintab?: string; subtab?: string; page?: string; search?: string }>;
}

export async function generateMetadata(props: IUserDetailsProps): Promise<Metadata> {
    const params = await props.params;
    const { userId } = params;
    let userInPage: any;

    try {
        userInPage = await getUserById(Number(userId));
    } catch (error) {
        return notFound();
    }

    const pageUrl = `${process.env.NEXT_PUBLIC_PROJECT_URL}/users/${userInPage.id}/${userInPage.userName}`;

    return {
        title: `${userInPage.userName} | User`,
        description: `${userInPage.bio}`,
        openGraph: {
            type: "video.tv_show",
            url: pageUrl,
            title: `${userInPage.userName} | User`,
            description: userInPage.bio,
            images: userInPage.avatar?.photoSrc
                ? [
                      {
                          url: userInPage.avatar?.photoSrc,
                          width: 160,
                          height: 200,
                          alt: userInPage.bio,
                      },
                  ]
                : [],
            siteName: "MovieLandia24",
        },
        twitter: {
            card: "summary_large_image",
            site: "@movieLandia24",
            creator: "movieLandia24",
            title: `${userInPage.userName} | User`,
            description: userInPage.bio,
            images: userInPage.avatar?.photoSrc
                ? [
                      {
                          url: userInPage.avatar?.photoSrc,
                          alt: userInPage.bio,
                      },
                  ]
                : [],
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function UserPage(props: IUserDetailsProps) {
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
    const userId = params.userId;

    const searchParams = await props.searchParams;
    const searchParamsKey = JSON.stringify(searchParams);

    const mainTab = searchParams?.maintab || "bookmarks";
    const subTab = searchParams?.subtab || "movies";
    const page = searchParams?.page ? Number(searchParams.page) : 1;
    const search = searchParams?.search || "";

    let userInPage;
    let additionalData: any = { items: [], total: 0 };
    let userFollowers: any;
    let userFollowing: any;
    let userPendingFollowers: any;

    try {
        userInPage = await getUserById(Number(userId), userSession?.id);
        userFollowers = await getFollowers(Number(userId));
        userFollowing = await getFollowing(Number(userId));
        userPendingFollowers = await getPendingFollowRequests(Number(userId));

        if (!userInPage) {
            return notFound();
        }

        if (mainTab === "bookmarks") {
            additionalData = await getUserFavorites(
                Number(userId),
                subTab.toLowerCase() as "movies" | "series" | "actors" | "crew" | "seasons" | "episodes",
                page,
                search,
            );
        } else if (mainTab === "reviews") {
            additionalData = await getUserReviews(
                Number(userId),
                subTab as "movies" | "series" | "actors" | "crew" | "seasons" | "episodes",
                page,
            );
        } else if (mainTab === "upvotes" || mainTab === "downvotes") {
            additionalData = await getUserVotes(
                Number(userId),
                subTab as "movies" | "series" | "actors" | "crew" | "seasons" | "episodes",
                mainTab,
                page,
            );
        }
    } catch (error) {
        return notFound();
    }

    return (
        <Suspense key={searchParamsKey} fallback={<LoadingSpinner />}>
            <UserPageContent
                userLoggedIn={userSession}
                userInPage={userInPage}
                additionalData={additionalData}
                userFollowers={userFollowers}
                userFollowing={userFollowing}
                userPendingFollowers={userPendingFollowers}
            />
        </Suspense>
    );
}
