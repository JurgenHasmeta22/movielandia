import { Container } from "@mui/material";
import { getLatestSeries, getRelatedSeries, getSerieByTitle } from "@/lib/actions/serie.actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import SeriePage from "./_components/SeriePage";
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

    const { description, photoSrcProd } = serie;

    const pageUrl = `${process.env.NEXT_PUBLIC_PROJECT_URL}/series/${title}`;

    return {
        title: `${title} | Serie`,
        description: `${serie.description}`,
        openGraph: {
            type: "video.tv_show",
            url: pageUrl,
            title: `${title} | Serie`,
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
            title: `${title} | Serie`,
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

export default async function Serie({ searchParams, params }: ISerieProps) {
    const session = await getServerSession(authOptions);

    const title = params.title;
    const ascOrDesc = searchParams?.seriesAscOrDesc;
    const page = searchParams?.page ? Number(searchParams!.page!) : 1;
    const sortBy = searchParams?.seriesSortBy ? searchParams?.seriesSortBy : "";
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
            <SeriePage
                searchParamsValues={searchParamsValues}
                serie={serie}
                latestSeries={latestSeries}
                relatedSeries={relatedSeries}
                pageCount={pageCountReviews}
            />
        </Container>
    );
}
