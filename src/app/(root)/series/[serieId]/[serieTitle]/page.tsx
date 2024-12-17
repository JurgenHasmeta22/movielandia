import { getLatestSeries, getRelatedSeries, getSerieById } from "@/actions/serie.actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Serie } from "@prisma/client";
import SeriePageContent from "./_components/SeriePageContent";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";
import { Suspense } from "react";

interface ISerieProps {
    params: {
        serieId: string;
    };
    searchParams?: {
        reviewsAscOrDesc: string | undefined;
        reviewsPage: string;
        reviewsSortBy: string;
        castPage?: string;
        crewPage?: string;
        seasonsPage?: string;
    };
}

export async function generateMetadata({ params }: ISerieProps): Promise<Metadata> {
    const { serieId } = params;

    let serie: Serie;

    try {
        serie = await getSerieById(Number(serieId), {});
    } catch (error) {
        return notFound();
    }

    const { description, photoSrcProd } = serie!;

    const pageUrl = `${process.env.NEXT_PUBLIC_PROJECT_URL}/series/${serie.title}`;

    return {
        title: `${serie.title} | Serie`,
        description: `${serie.description}`,
        openGraph: {
            type: "video.tv_show",
            url: pageUrl,
            title: `${serie.title} | Serie`,
            description,
            images: photoSrcProd
                ? [
                      {
                          url: photoSrcProd,
                          width: 160,
                          height: 200,
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
            title: `${serie.title} | Serie`,
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

export default async function SeriePage(props: ISerieProps) {
    const session = await getServerSession(authOptions);

    const params = props.params;
    const serieId = params.serieId;

    const searchParams = props.searchParams;
    const searchParamsKey = JSON.stringify(searchParams);

    const reviewsAscOrDesc = searchParams?.reviewsAscOrDesc;
    const reviewsSortBy = searchParams?.reviewsSortBy || "";
    const reviewsPage = searchParams?.reviewsPage ? Number(searchParams.reviewsPage) : 1;

    const castPage = searchParams?.castPage ? Number(searchParams.castPage) : 1;
    const crewPage = searchParams?.crewPage ? Number(searchParams.crewPage) : 1;
    const seasonsPage = searchParams?.seasonsPage ? Number(searchParams.seasonsPage) : 1;

    const searchParamsValues = {
        reviewsAscOrDesc,
        reviewsPage,
        reviewsSortBy,
        castPage,
        crewPage,
        seasonsPage,
        userId: Number(session?.user?.id),
    };

    let serie = null;

    try {
        serie = await getSerieById(Number(serieId), searchParamsValues);
    } catch (error) {
        return notFound();
    }

    const relatedSeries = await getRelatedSeries(Number(serieId), Number(session?.user?.id));

    const perPage = 6;
    const pageCountReviews = Math.ceil(serie.totalReviews / 5);
    const castPageCount = Math.ceil(serie.totalCast / perPage);
    const crewPageCount = Math.ceil(serie.totalCrew / perPage);
    const seasonsPageCount = Math.ceil(serie.totalSeasons / perPage);

    return (
        <Suspense key={searchParamsKey} fallback={<LoadingSpinner />}>
            <SeriePageContent
                searchParamsValues={{
                    reviewsAscOrDesc,
                    reviewsPage: Number(reviewsPage),
                    reviewsSortBy,
                    castPage: Number(castPage) || 1,
                    crewPage: Number(crewPage) || 1,
                    seasonsPage: Number(seasonsPage) || 1,
                }}
                serie={serie}
                relatedSeries={relatedSeries}
                reviewsPageCount={pageCountReviews}
                castPageCount={castPageCount}
                crewPageCount={crewPageCount}
                seasonsPageCount={seasonsPageCount}
            />
        </Suspense>
    );
}
