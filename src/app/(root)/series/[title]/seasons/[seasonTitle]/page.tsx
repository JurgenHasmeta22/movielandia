import { Container } from "@mui/material";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SeasonPage from "./_components/SeasonPage";
import { getSeasonByTitle, getLatestSeasons, getRelatedSeasons } from "@/lib/actions/season.actions";

interface ISeasonProps {
    params: {
        seasonTitle: string;
    };
    searchParams?: { seasonsAscOrDesc?: string; page?: string; seasonsSortBy?: string };
}

export async function generateMetadata({ params }: ISeasonProps): Promise<Metadata> {
    const { seasonTitle } = params;
    let season = null;

    try {
        season = await getSeasonByTitle(seasonTitle, {});
        console.log(season);
    } catch (error) {
        console.log(error);
        return notFound();
    }

    const { description, photoSrc } = season;

    const pageUrl = `${process.env.NEXT_PUBLIC_PROJECT_URL}/seasons/${seasonTitle}`;

    return {
        title: `${seasonTitle} | Season`,
        description: `${season.description}`,
        openGraph: {
            type: "video.tv_show",
            url: pageUrl,
            title: `${seasonTitle} | Season`,
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
            title: `${seasonTitle} | Season`,
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

export default async function Season({ searchParams, params }: ISeasonProps) {
    const session = await getServerSession(authOptions);

    const title = params.seasonTitle;
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
        season = await getSeasonByTitle(title, searchParamsValues);
        console.log(season);
    } catch (error) {
        return notFound();
    }

    const latestSeasons = await getLatestSeasons();
    const relatedSeasons = await getRelatedSeasons(title);

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
