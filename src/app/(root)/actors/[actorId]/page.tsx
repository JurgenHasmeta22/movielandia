import { Metadata } from "next";
import ActorDetails from "./[actorFullname]/page";
import { getActorById } from "@/lib/actions/actor.actions";
import { Actor } from "@prisma/client";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { actorId: string } }): Promise<Metadata> {
    const { actorId } = params;

    let actor: Actor | null = null;

    try {
        actor = await getActorById(Number(actorId), {});
    } catch (error) {
        return notFound();
    }

    const { description, photoSrcProd } = actor!;

    const pageUrl = `${process.env.NEXT_PUBLIC_PROJECT_URL}/actors/${actor?.fullname}`;

    return {
        title: `${actor?.fullname} | Actor`,
        description: `${actor?.description}`,
        openGraph: {
            type: "video.tv_show",
            url: pageUrl,
            title: `${actor?.fullname} | Actor`,
            description,
            images: photoSrcProd
                ? [
                      {
                          url: photoSrcProd,
                          width: 200,
                          height: 300,
                          alt: description,
                      },
                  ]
                : [],
            siteName: "MovieLandia24",
        },
        twitter: {
            card: "summary_large_image",
            site: "@movieLandia24",
            creator: "movieLandia24",
            title: `${actor?.fullname} | Actor`,
            description,
            images: photoSrcProd
                ? [
                      {
                          url: photoSrcProd,
                          alt: description,
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

export default function Page({ params }: { params: { actorId: string } }) {
    return <ActorDetails params={params} />;
}
