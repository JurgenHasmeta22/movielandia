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
        reviewsPage: number;
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

    const ascOrDesc = searchParams?.reviewsAscOrDesc;
    const page = searchParams?.reviewsPage ? Number(searchParams.reviewsPage) : 1;
    const sortBy = searchParams?.reviewsSortBy || "";
    const castPage = searchParams?.castPage;
    const crewPage = searchParams?.crewPage;
    const seasonsPage = searchParams?.seasonsPage;

    const searchParamsValues = {
        ascOrDesc,
        page,
        sortBy,
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

    const latestSeries = await getLatestSeries(Number(session?.user?.id));
    const relatedSeries = await getRelatedSeries(Number(serieId), Number(session?.user?.id));

    const pageCountReviews = Math.ceil(serie.totalReviews / 5);
    const castPageCount = Math.ceil(serie.totalCast / 6);
    const crewPageCount = Math.ceil(serie.totalCrew / 6);
    const seasonsPageCount = Math.ceil(serie.totalSeasons / 6);

    return (
        <Suspense key={searchParamsKey} fallback={<LoadingSpinner />}>
            <SeriePageContent
                searchParamsValues={{
                    ascOrDesc,
                    page: Number(page),
                    sortBy,
                    castPage: Number(castPage) || 1,
                    crewPage: Number(crewPage) || 1,
                    seasonsPage: Number(seasonsPage) || 1,
                }}
                serie={serie}
                latestSeries={latestSeries}
                relatedSeries={relatedSeries}
                pageCount={pageCountReviews}
                castPageCount={castPageCount}
                crewPageCount={crewPageCount}
                seasonsPageCount={seasonsPageCount}
            />
        </Suspense>
    );
}
