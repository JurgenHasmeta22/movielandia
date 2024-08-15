import { getLatestSeries, getRelatedSeries, getSerieById, getSerieByTitle } from "@/actions/serie.actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Serie } from "@prisma/client";
import SeriePageContent from "./_components/SeriePageContent";

interface ISerieProps {
    params: {
        serieId: string;
    };
    searchParams?: { reviewsAscOrDesc: string | undefined; reviewsPage: number; reviewsSortBy: string };
}

export async function generateMetadata({ params }: ISerieProps): Promise<Metadata> {
    const { serieId } = params;

    let serie: Serie | null = null;

    try {
        serie = await getSerieById(Number(serieId), {});
    } catch (error) {
        return notFound();
    }

    const { description, photoSrcProd } = serie!;

    const pageUrl = `${process.env.NEXT_PUBLIC_PROJECT_URL}/series/${serie?.title}`;

    return {
        title: `${serie?.title} | Serie`,
        description: `${serie?.description}`,
        openGraph: {
            type: "video.tv_show",
            url: pageUrl,
            title: `${serie?.title} | Serie`,
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
            title: `${serie?.title} | Serie`,
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

export default async function SeriePage({ searchParams, params }: ISerieProps) {
    const session = await getServerSession(authOptions);

    const serieId = params.serieId;

    const ascOrDesc = searchParams?.reviewsAscOrDesc;
    const page = searchParams?.reviewsPage ? Number(searchParams!.reviewsPage!) : 1;
    const sortBy = searchParams?.reviewsSortBy ? searchParams?.reviewsSortBy : "";
    const searchParamsValues = {
        ascOrDesc,
        page,
        sortBy,
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

    const pageCountReviews = Math.ceil(serie?.totalReviews / 5);

    return (
        <SeriePageContent
            searchParamsValues={searchParamsValues}
            serie={serie}
            latestSeries={latestSeries}
            relatedSeries={relatedSeries}
            pageCount={pageCountReviews}
        />
    );
}
