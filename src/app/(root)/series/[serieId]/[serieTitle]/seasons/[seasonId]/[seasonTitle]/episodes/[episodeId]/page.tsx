import { Metadata } from "next";
import { Episode } from "@prisma/client";
import { notFound } from "next/navigation";
import { getEpisodeById } from "@/actions/episode.actions";
import EpisodePage from "./[episodeTitle]/page";

export async function generateMetadata(props: {
    params: Promise<{ episodeId: string; seasonId: string }>;
}): Promise<Metadata> {
    const params = await props.params;
    const { episodeId } = params;

    let episode: Episode;

    try {
        episode = await getEpisodeById(Number(episodeId), {});
    } catch (error) {
        return notFound();
    }

    const { description, photoSrcProd } = episode;

    const pageUrl = `${process.env.NEXT_PUBLIC_PROJECT_URL}/episodes/${episode.title}`;

    return {
        title: `${episode.title} | Episode`,
        description: `${episode.description}`,
        openGraph: {
            type: "video.tv_show",
            url: pageUrl,
            title: `${episode.title} | Episode`,
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
            siteName: "EpisodeLandia24",
        },
        twitter: {
            card: "summary_large_image",
            site: "@episodeLandia24",
            creator: "episodeLandia24",
            title: `${episode.title} | Episode`,
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

export default async function Page(props: { params: Promise<{ episodeId: string; seasonId: string }> }) {
    const params = await props.params;
    return <EpisodePage params={params} />;
}
