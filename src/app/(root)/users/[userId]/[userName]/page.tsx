import { Metadata } from "next";
import ProfilePage from "./_components/UserPage";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserById } from "@/lib/actions/user.actions";
import { User } from "@prisma/client";
import { notFound } from "next/navigation";

interface IUserDetailsProps {
    params: {
        userId: string;
    };
    searchParams?: { tab?: string };
}

export async function generateMetadata({ params }: IUserDetailsProps): Promise<Metadata> {
    const { userId } = params;

    let user: User | null = null;

    try {
        user = await getUserById(Number(userId), {});
    } catch (error) {
        return notFound();
    }

    const { bio, photoSrcProd } = user!;

    const pageUrl = `${process.env.NEXT_PUBLIC_PROJECT_URL}/users/${user?.id}/${user?.userName}`;

    return {
        title: `${user?.userName} | User`,
        description: `${user?.bio}`,
        openGraph: {
            type: "video.tv_show",
            url: pageUrl,
            title: `${user?.userName} | User`,
            description: user?.bio,
            images: photoSrcProd
                ? [
                      {
                          url: photoSrcProd,
                          width: 160,
                          height: 200,
                          alt: bio,
                      },
                  ]
                : [],
            siteName: "MovieLandia24",
        },
        twitter: {
            card: "summary_large_image",
            site: "@movieLandia24",
            creator: "movieLandia24",
            title: `${user?.userName} | User`,
            description: bio,
            images: photoSrcProd
                ? [
                      {
                          url: photoSrcProd,
                          alt: user?.bio,
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
    let userInPage = null;

    const session = await getServerSession(authOptions);
    const userSession = (session && session.user) || null;
    const userLoggedIn = await getUserById(Number(userSession?.id));

    try {
        userInPage = await getUserById(Number(userId));
    } catch (error) {
        return notFound();
    }

    return <ProfilePage userLoggedIn={userLoggedIn} userInPage={userInPage} tabValue={tabValue} />;
}
