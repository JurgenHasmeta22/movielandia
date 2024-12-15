import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getRelatedSeasons, getSeasonById } from "@/actions/season.actions";
import { Season } from "@prisma/client";
import SeasonPageContent from "./_components/SeasonPageContent";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";
import { Suspense } from "react";

interface ISeasonProps {
    params: {
        seasonId: string;
        serieId: string;
    };
    searchParams?: {
        reviewsAscOrDesc: string | undefined;
        reviewsPage: string;
        reviewsSortBy: string;
        episodesPage?: string;
    };
}

export async function generateMetadata({ params }: ISeasonProps): Promise<Metadata> {
    const { seasonId } = params;

    let season: Season;

    try {
        season = await getSeasonById(Number(seasonId), {});
    } catch (error) {
        return notFound();
    }

    const { description, photoSrcProd } = season;
    const pageUrl = `${process.env.NEXT_PUBLIC_PROJECT_URL}/seasons/${season.title}`;

    return {
        title: `${season.title} | Season`,
        description: `${season.description}`,
        openGraph: {
            type: "video.tv_show",
            url: pageUrl,
            title: `${season.title} | Season`,
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
            title: `${season.title} | Season`,
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

export default async function SeasonPage(props: ISeasonProps) {
    const session = await getServerSession(authOptions);

    const params = props.params;
    const { seasonId, serieId } = params;

    const searchParams = props.searchParams;
    const searchParamsKey = JSON.stringify(searchParams);

    const reviewsAscOrDesc = searchParams?.reviewsAscOrDesc;
    const reviewsSortBy = searchParams?.reviewsSortBy || "";

    const reviewsPage = searchParams?.reviewsPage ? Number(searchParams.reviewsPage) : 1;
    const episodesPage = searchParams?.episodesPage ? Number(searchParams.episodesPage) : 1;

    const searchParamsValues = {
        reviewsAscOrDesc,
        reviewsPage,
        reviewsSortBy,
        episodesPage,
        userId: Number(session?.user?.id),
    };

    let season = null;

    try {
        season = await getSeasonById(Number(seasonId), searchParamsValues);
    } catch (error) {
        return notFound();
    }

    const relatedSeasons = await getRelatedSeasons(Number(seasonId), Number(serieId));

    const perPage = 6;
    const pageCountReviews = Math.ceil(season.totalReviews / 5);
    const episodesPageCount = Math.ceil(season.totalEpisodes / perPage);

    return (
        <Suspense key={searchParamsKey} fallback={<LoadingSpinner />}>
            <SeasonPageContent
                searchParamsValues={{
                    reviewsAscOrDesc,
                    reviewsPage: Number(reviewsPage),
                    reviewsSortBy,
                    episodesPage: Number(episodesPage),
                }}
                season={season}
                relatedSeasons={relatedSeasons}
                reviewsPageCount={pageCountReviews}
                episodesPageCount={episodesPageCount}
            />
        </Suspense>
    );
}
