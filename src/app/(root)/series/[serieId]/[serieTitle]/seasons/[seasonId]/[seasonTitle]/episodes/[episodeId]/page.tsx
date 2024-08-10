import { Metadata } from "next";
import { Episode } from "@prisma/client";
import { notFound } from "next/navigation";
import { getEpisodeById } from "@/actions/episode.actions";
import EpisodeDetails from "./[episodeTitle]/page";

export async function generateMetadata({
    params,
}: {
    params: { episodeId: string; seasonId: string };
}): Promise<Metadata> {
    const { episodeId } = params;

    let episode: Episode | null = null;

    try {
        episode = await getEpisodeById(Number(episodeId), {});
    } catch (error) {
        return notFound();
    }

    const { description, photoSrcProd } = episode!;

    const pageUrl = `${process.env.NEXT_PUBLIC_PROJECT_URL}/episodes/${episode?.title}`;

    return {
        title: `${episode?.title} | Episode`,
        description: `${episode?.description}`,
        openGraph: {
            type: "video.tv_show",
            url: pageUrl,
            title: `${episode?.title} | Episode`,
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
            title: `${episode?.title} | Episode`,
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

export default function Page({ params }: { params: { episodeId: string; seasonId: string } }) {
    return <EpisodeDetails params={params} />;
}
