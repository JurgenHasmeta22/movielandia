import { Container } from "@mui/material";
import { getLatestSeries, getRelatedSeries, getSerieByTitle } from "@/lib/actions/serie.action";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import SeriePageDetails from "./SeriePageDetails";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface ISerieProps {
    params: {
        title: string;
    };
    searchParams?: { seriesAscOrDesc?: string; page?: string; seriesSortBy?: string };
}

export async function generateMetadata({ params }: ISerieProps): Promise<Metadata> {
    const { title } = params;
    let serie = null;

    try {
        serie = await getSerieByTitle(title, {});
    } catch (error) {
        return notFound();
    }

    const { description, photoSrc } = serie;
    const siteUrl = "https://movielandia24.com";
    const pageUrl = `${siteUrl}/series/${title}`;

    return {
        title: `${title} | Serie`,
        description: `${serie.description}`,
        openGraph: {
            type: "video.tv_show",
            url: pageUrl,
            title: `${title} | Serie`,
            description,
            images: photoSrc
                ? [
                      {
                          url: photoSrc,
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
            title: `${title} | Serie`,
            description,
            images: photoSrc
                ? [
                      {
                          url: photoSrc,
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

export default async function Serie({ searchParams, params }: ISerieProps) {
    const title = params?.title;

    const ascOrDesc = searchParams?.seriesAscOrDesc;
    const page = searchParams?.page ? Number(searchParams!.page!) : 1;
    const sortBy = searchParams?.seriesSortBy ? searchParams?.seriesSortBy : "";
    const session = await getServerSession(authOptions);
    const searchParamsValues = {
        ascOrDesc,
        page,
        sortBy,
        userId: Number(session?.user?.id),
    };

    let serie = null;

    try {
        serie = await getSerieByTitle(title, searchParamsValues);
    } catch (error) {
        return notFound();
    }

    const latestSeries = await getLatestSeries();
    const relatedSeries = await getRelatedSeries(title);

    const pageCountReviews = Math.ceil(serie?.totalReviews / 5);

    return (
        <Container>
            <SeriePageDetails
                searchParamsValues={searchParamsValues}
                serie={serie}
                latestSeries={latestSeries}
                relatedSeries={relatedSeries}
                pageCount={pageCountReviews}
            />
        </Container>
    );
}
