import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserById, getUserFavorites, getUserReviews, getUserVotes } from "@/actions/user.actions";
import { notFound } from "next/navigation";
import UserPageContent from "./_components/UserPageContent";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";
import { Suspense } from "react";

interface IUserDetailsProps {
    params: {
        userId: string;
    };
    searchParams?: Promise<{ maintab?: string; subtab?: string; page?: number }>;
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
            images: userInPage.avatar?.photoSrc!
                ? [
                      {
                          url: userInPage.avatar?.photoSrc!,
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
            images: userInPage.avatar?.photoSrc!
                ? [
                      {
                          url: userInPage.avatar?.photoSrc!,
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
    const mainTab = searchParams && searchParams.maintab ? searchParams.maintab : "bookmarks";
    const subTab = searchParams && searchParams.subtab ? searchParams.subtab : "movies";
    const page = searchParams && searchParams.page ? searchParams.page : 1;

    let userInPage;
    let additionalData: any = { items: [], total: 0 };

    try {
        userInPage = await getUserById(Number(userId), userSession?.id);

        if (!userInPage) {
            return notFound();
        }

        if (mainTab === "bookmarks") {
            additionalData = await getUserFavorites(
                Number(userId),
                subTab as "movies" | "series" | "actors" | "crew" | "seasons" | "episodes",
                page,
            );
        } else if (mainTab === "reviews") {
            additionalData = await getUserReviews(
                Number(userId),
                subTab.slice(0, -1) as "movies" | "series" | "actors" | "crew" | "seasons" | "episodes",
                page,
            );
        } else if (mainTab === "upvotes" || mainTab === "downvotes") {
            additionalData = await getUserVotes(
                Number(userId),
                subTab.slice(0, -1) as "movies" | "series" | "actors" | "crew" | "seasons" | "episodes",
                mainTab,
                page,
            );
        }
    } catch (error) {
        return notFound();
    }

    return (
        <Suspense key={searchParamsKey} fallback={<LoadingSpinner />}>
            <UserPageContent userLoggedIn={userSession} userInPage={userInPage} additionalData={additionalData} />
        </Suspense>
    );
}
