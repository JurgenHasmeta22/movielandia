import { Container } from "@mui/material";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SeasonPage from "./_components/SeasonPage";
import { getSeasonByTitle, getLatestSeasons, getRelatedSeasons } from "@/lib/actions/season.actions";
import { getSerieByTitle } from "@/lib/actions/serie.actions";
import { Serie } from "@prisma/client";

interface ISeasonProps {
    params: {
        seasonTitle: string;
        serieTitle: string;
    };
    searchParams?: { seasonsAscOrDesc?: string; page?: string; seasonsSortBy?: string };
}

export async function generateMetadata({ params }: ISeasonProps): Promise<Metadata> {
    const { seasonTitle, serieTitle } = params;

    const serieOfSeason: Serie | null = await getSerieByTitle(serieTitle, {});

    let season = null;

    try {
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        season = await getSeasonByTitle(seasonTitle, serieOfSeason?.id!, {});
    } catch (error) {
        return notFound();
    }

    const { description, photoSrcProd } = season;

    const pageUrl = `${process.env.NEXT_PUBLIC_PROJECT_URL}/seasons/${seasonTitle}`;

    return {
        title: `${seasonTitle} | Season`,
        description: `${season.description}`,
        openGraph: {
            type: "video.tv_show",
            url: pageUrl,
            title: `${seasonTitle} | Season`,
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
            title: `${seasonTitle} | Season`,
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

export default async function Season({ searchParams, params }: ISeasonProps) {
    const session = await getServerSession(authOptions);

    const { seasonTitle, serieTitle } = params;

    const serieOfSeason = await getSerieByTitle(serieTitle, {});

    const ascOrDesc = searchParams?.seasonsAscOrDesc;
    const page = searchParams?.page ? Number(searchParams!.page!) : 1;
    const sortBy = searchParams?.seasonsSortBy ? searchParams?.seasonsSortBy : "";
    const searchParamsValues = {
        ascOrDesc,
        page,
        sortBy,
        userId: Number(session?.user?.id),
    };

    let season = null;

    try {
        season = await getSeasonByTitle(seasonTitle, serieOfSeason?.id, searchParamsValues);
    } catch (error) {
        return notFound();
    }

    const latestSeasons = await getLatestSeasons(serieOfSeason?.id);
    const relatedSeasons = await getRelatedSeasons(seasonTitle, serieOfSeason?.id);

    const pageCountReviews = Math.ceil(season?.totalReviews / 5);

    return (
        <Container>
            <SeasonPage
                searchParamsValues={searchParamsValues}
                season={season}
                latestSeasons={latestSeasons}
                relatedSeasons={relatedSeasons}
                pageCount={pageCountReviews}
            />
        </Container>
    );
}
