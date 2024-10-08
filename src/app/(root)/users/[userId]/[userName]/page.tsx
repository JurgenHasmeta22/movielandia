import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserById } from "@/actions/user.actions";
import { notFound } from "next/navigation";
import UserPageContent from "./_components/UserPageContent";

interface IUserDetailsProps {
    params: {
        userId: string;
    };
    searchParams?: { tab?: string };
}

export async function generateMetadata({ params }: IUserDetailsProps): Promise<Metadata> {
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
            images: userInPage.avatar!.photoSrc
                ? [
                      {
                          url: userInPage.avatar!.photoSrc,
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
            images: userInPage.avatar!.photoSrc
                ? [
                      {
                          url: userInPage.avatar!.photoSrc,
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

export default async function UserPage({ searchParams, params }: IUserDetailsProps) {
    const tabValue = searchParams && searchParams.tab ? searchParams.tab : "favMovies";
    const userId = params.userId;

    const session = await getServerSession(authOptions);
    const userSession = (session && session.user) || null;

    let userInPage;

    try {
        userInPage = await getUserById(Number(userId), Number(userSession?.id));
    } catch (error) {
        return notFound();
    }

    return <UserPageContent userLoggedIn={userSession} userInPage={userInPage} tabValue={tabValue} />;
}
