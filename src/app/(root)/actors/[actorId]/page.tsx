import { Metadata } from "next";
import { getActorById } from "@/actions/actor.actions";
import { Actor } from "@prisma/client";
import { notFound } from "next/navigation";
import ActorPage from "./[actorFullname]/page";

export async function generateMetadata(props: { params: Promise<{ actorId: string }> }): Promise<Metadata> {
    const params = await props.params;
    const { actorId } = params;

    let actor: Actor;

    try {
        actor = await getActorById(Number(actorId), {});
    } catch (error) {
        return notFound();
    }

    const { description, photoSrcProd } = actor;

    const pageUrl = `${process.env.NEXT_PUBLIC_PROJECT_URL}/actors/${actor.fullname}`;

    return {
        title: `${actor.fullname} | Actor`,
        description: `${actor.description}`,
        openGraph: {
            type: "video.tv_show",
            url: pageUrl,
            title: `${actor.fullname} | Actor`,
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
            title: `${actor.fullname} | Actor`,
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

export default async function Page(props: { params: Promise<{ actorId: string }> }) {
    const params = await props.params;
    return <ActorPage params={params} />;
}
