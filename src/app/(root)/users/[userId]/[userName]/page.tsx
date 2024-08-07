import { Metadata } from "next";
import ProfilePage from "./_components/UserPage";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserById } from "@/lib/actions/user.actions";
import { notFound } from "next/navigation";

interface IUserDetailsProps {
    params: {
        userId: string;
    };
    searchParams?: { tab?: string };
}

export async function generateMetadata({ params }: IUserDetailsProps): Promise<Metadata> {
    const { userId } = params;

    let userInPage: any | null = null;

    try {
        userInPage = await getUserById(Number(userId));
    } catch (error) {
        return notFound();
    }

    const pageUrl = `${process.env.NEXT_PUBLIC_PROJECT_URL}/users/${userInPage?.id}/${userInPage?.userName}`;

    return {
        title: `${userInPage?.userName} | User`,
        description: `${userInPage?.bio}`,
        openGraph: {
            type: "video.tv_show",
            url: pageUrl,
            title: `${userInPage?.userName} | User`,
            description: userInPage?.bio,
            images: userInPage?.avatar?.photoSrc
                ? [
                      {
                          url: userInPage?.avatar?.photoSrc,
                          width: 160,
                          height: 200,
                          alt: userInPage?.bio,
                      },
                  ]
                : [],
            siteName: "MovieLandia24",
        },
        twitter: {
            card: "summary_large_image",
            site: "@movieLandia24",
            creator: "movieLandia24",
            title: `${userInPage?.userName} | User`,
            description: userInPage?.bio,
            images: userInPage?.avatar?.photoSrc
                ? [
                      {
                          url: userInPage?.avatar?.photoSrc,
                          alt: userInPage?.bio,
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

export default async function UserDetails({ searchParams, params }: IUserDetailsProps) {
    const tabValue = searchParams?.tab ? searchParams?.tab : "favMovies";
    const userId = params.userId;

    const session = await getServerSession(authOptions);
    const userSession = (session && session.user) || null;

    let userInPage = null;

    try {
        userInPage = await getUserById(Number(userId), Number(userSession?.id));
    } catch (error) {
        return notFound();
    }

    return <ProfilePage userLoggedIn={userSession} userInPage={userInPage} tabValue={tabValue} />;
}
