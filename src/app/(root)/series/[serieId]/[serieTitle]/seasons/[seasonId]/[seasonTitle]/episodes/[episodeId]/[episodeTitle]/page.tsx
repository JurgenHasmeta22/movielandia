import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getEpisodeById, getRelatedEpisodes } from "@/actions/episode.actions";
import { Episode } from "@prisma/client";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";
import { Suspense } from "react";
import EpisodePageContent from "./_components/EpisodePageContent";

interface IEpisodeProps {
    params: {
        episodeId: string;
        seasonId: string;
    };
    searchParams?: {
        reviewsAscOrDesc: string | undefined;
        reviewsPage: string;
        reviewsSortBy: string;
        relatedPage?: string;
    };
}

export async function generateMetadata({ params }: IEpisodeProps): Promise<Metadata> {
    const { episodeId } = await params;

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
            siteName: "MovieLandia24",
        },
        twitter: {
            card: "summary_large_image",
            site: "@movieLandia24",
            creator: "movieLandia24",
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

export default async function EpisodePage(props: IEpisodeProps) {
    const session = await getServerSession(authOptions);

    const params = await props.params;
    const { episodeId, seasonId } = params;

    const searchParams = await props.searchParams;
    const searchParamsKey = JSON.stringify(searchParams);

    const reviewsAscOrDesc = searchParams?.reviewsAscOrDesc;
    const reviewsSortBy = searchParams?.reviewsSortBy || "";
    const reviewsPage = searchParams?.reviewsPage ? Number(searchParams.reviewsPage) : 1;
    const relatedPage = searchParams?.relatedPage ? Number(searchParams.relatedPage) : 1;

    const searchParamsValues = {
        reviewsAscOrDesc,
        reviewsPage,
        reviewsSortBy,
        userId: Number(session?.user?.id),
    };

    let episode = null;

    try {
        episode = await getEpisodeById(Number(episodeId), searchParamsValues);
    } catch (error) {
        return notFound();
    }

    const { episodes: relatedEpisodes, count: totalRelated } = await getRelatedEpisodes(
        Number(episodeId),
        Number(seasonId),
        relatedPage,
    );

    const pageCountReviews = Math.ceil(episode.totalReviews / 5);
    const relatedPageCount = Math.ceil(totalRelated / 6);

    return (
        <Suspense key={searchParamsKey} fallback={<LoadingSpinner />}>
            <EpisodePageContent
                searchParamsValues={{
                    reviewsAscOrDesc,
                    reviewsPage: Number(reviewsPage),
                    reviewsSortBy,
                    relatedPage,
                }}
                episode={episode}
                relatedEpisodes={relatedEpisodes}
                reviewsPageCount={pageCountReviews}
                relatedPageCount={relatedPageCount}
            />
        </Suspense>
    );
}
