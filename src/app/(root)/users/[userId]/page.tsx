import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUserById } from "@/actions/user.actions";
import UserPage from "./[userName]/page";

export async function generateMetadata({ params }: { params: { userId: string } }): Promise<Metadata> {
    const { userId } = params;

    let user: any;

    try {
        user = await getUserById(Number(userId));
    } catch (error) {
        return notFound();
    }

    const pageUrl = `${process.env.NEXT_PUBLIC_PROJECT_URL}/users/${user.id}/${user.userName}`;

    return {
        title: `${user.userName} | User`,
        description: `${user.bio}`,
        openGraph: {
            type: "video.tv_show",
            url: pageUrl,
            title: `${user.userName} | User`,
            description: user.bio,
            images: user.avatar!.photoSrc
                ? [
                      {
                          url: user.avatar!.photoSrc,
                          width: 160,
                          height: 200,
                          alt: user.bio,
                      },
                  ]
                : [],
            siteName: "MovieLandia24",
        },
        twitter: {
            card: "summary_large_image",
            site: "@movieLandia24",
            creator: "movieLandia24",
            title: `${user.userName} | User`,
            description: user.bio,
            images: user.avatar!.photoSrc
                ? [
                      {
                          url: user.avatar!.photoSrc,
                          alt: user.bio,
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

export default function Page({ params }: { params: { userId: string } }) {
    return <UserPage params={params} />;
}
