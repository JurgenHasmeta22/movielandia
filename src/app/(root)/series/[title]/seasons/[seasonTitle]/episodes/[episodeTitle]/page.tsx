import { Container } from "@mui/material";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getEpisodeByTitle, getLatestEpisodes, getRelatedEpisodes } from "@/lib/actions/episode.actions";
import EpisodePage from "../_components/EpisodePage";

interface IEpisodeProps {
    params: {
        episodeTitle: string;
    };
    searchParams?: { episodesAscOrDesc?: string; page?: string; episodesSortBy?: string };
}

export async function generateMetadata({ params }: IEpisodeProps): Promise<Metadata> {
    const { episodeTitle } = params;
    let episode = null;

    try {
        episode = await getEpisodeByTitle(episodeTitle, {});
    } catch (error) {
        return notFound();
    }

    const { description, photoSrcProd } = episode;

    const pageUrl = `${process.env.NEXT_PUBLIC_PROJECT_URL}/episodes/${episodeTitle}`;

    return {
        title: `${episodeTitle} | Episode`,
        description: `${episode.description}`,
        openGraph: {
            type: "video.tv_show",
            url: pageUrl,
            title: `${episodeTitle} | Episode`,
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
            title: `${episodeTitle} | Episode`,
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

export default async function Episode({ searchParams, params }: IEpisodeProps) {
    const session = await getServerSession(authOptions);

    const title = params.episodeTitle;
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
        episode = await getEpisodeByTitle(title, searchParamsValues);
        console.log(episode);
    } catch (error) {
        return notFound();
    }

    const latestEpisodes = await getLatestEpisodes();
    const relatedEpisodes = await getRelatedEpisodes(title);

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
