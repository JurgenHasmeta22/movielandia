import { Container } from "@mui/material";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SeasonPage from "./_components/SeasonPage";
import { getLatestSeasons, getRelatedSeasons, getSeasonById } from "@/lib/actions/season.actions";
import { Season } from "@prisma/client";

interface ISeasonProps {
    params: {
        seasonId: string;
        serieId: string;
    };
    searchParams?: { seasonsAscOrDesc?: string; page?: string; seasonsSortBy?: string };
}

export async function generateMetadata({ params }: ISeasonProps): Promise<Metadata> {
    const { seasonId } = params;

    let season: Season | null = null;

    try {
        season = await getSeasonById(Number(seasonId), {});
    } catch (error) {
        return notFound();
    }

    const { description, photoSrcProd } = season!;

    const pageUrl = `${process.env.NEXT_PUBLIC_PROJECT_URL}/seasons/${season?.title}`;

    return {
        title: `${season?.title} | Season`,
        description: `${season?.description}`,
        openGraph: {
            type: "video.tv_show",
            url: pageUrl,
            title: `${season?.title} | Season`,
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
            title: `${season?.title} | Season`,
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

export default async function SeasonDetails({ searchParams, params }: ISeasonProps) {
    const session = await getServerSession(authOptions);

    const { seasonId, serieId } = params;
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
        season = await getSeasonById(Number(seasonId), searchParamsValues);
    } catch (error) {
        return notFound();
    }

    const latestSeasons = await getLatestSeasons(Number(serieId));
    const relatedSeasons = await getRelatedSeasons(Number(seasonId), Number(serieId));

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
