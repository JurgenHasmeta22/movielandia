import { Container } from "@mui/material";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getEpisodeById, getLatestEpisodes, getRelatedEpisodes } from "@/actions/episode.actions";
import EpisodePage from "../../_components/EpisodePage";
import { Episode } from "@prisma/client";

interface IEpisodeProps {
    params: {
        episodeId: string;
        seasonId: string;
    };
    searchParams?: { episodesAscOrDesc?: string; page?: string; episodesSortBy?: string };
}

export async function generateMetadata({ params }: IEpisodeProps): Promise<Metadata> {
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
            siteName: "MovieLandia24",
        },
        twitter: {
            card: "summary_large_image",
            site: "@movieLandia24",
            creator: "movieLandia24",
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

export default async function EpisodeDetails({ searchParams, params }: IEpisodeProps) {
    const session = await getServerSession(authOptions);

    const { episodeId, seasonId } = params;
    const ascOrDesc = searchParams?.episodesAscOrDesc;
    const page = searchParams?.page ? Number(searchParams!.page!) : 1;
    const sortBy = searchParams?.episodesSortBy ? searchParams?.episodesSortBy : "";
    const searchParamsValues = {
        ascOrDesc,
        page,
        sortBy,
        userId: Number(session?.user?.id),
    };

    let episode = null;

    try {
        episode = await getEpisodeById(Number(episodeId), searchParamsValues);
    } catch (error) {
        return notFound();
    }

    const latestEpisodes = await getLatestEpisodes(Number(seasonId));
    const relatedEpisodes = await getRelatedEpisodes(Number(episodeId), Number(seasonId));

    const pageCountReviews = Math.ceil(episode?.totalReviews / 5);

    return (
        <Container>
            <EpisodePage
                searchParamsValues={searchParamsValues}
                episode={episode}
                latestEpisodes={latestEpisodes}
                relatedEpisodes={relatedEpisodes}
                pageCount={pageCountReviews}
            />
        </Container>
    );
}
