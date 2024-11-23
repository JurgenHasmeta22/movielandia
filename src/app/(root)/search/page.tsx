import { Suspense } from "react";
import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SearchPageContent from "./_components/SearchPageContent";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";

interface ISearchProps {
    searchParams?: Promise<{
        moviesAscOrDesc?: string;
        pageMovies?: string;
        moviesSortBy?: string;
        seriesAscOrDesc?: string;
        pageSeries?: string;
        seriesSortBy?: string;
        actorsAscOrDesc?: string;
        pageActors?: string;
        actorsSortBy?: string;
        seasonsAscOrDesc?: string;
        pageSeasons?: string;
        seasonsSortBy?: string;
        episodesAscOrDesc?: string;
        pageEpisodes?: string;
        episodesSortBy?: string;
        usersAscOrDesc?: string;
        pageUsers?: string;
        usersSortBy?: string;
        term?: string;
    }>;
}

export const metadata: Metadata = {
    title: "Search Movies, Series, Actors and More | High-Quality and Always Updated",
    description:
        "Search through our vast collection of movies, series, actors, episodes, and more. Our content is always updated with the newest releases.",
    openGraph: {
        type: "website",
        url: `${process.env.NEXT_PUBLIC_PROJECT_URL}/search`,
        title: "Search Movies, Series, Actors and More",
        description: "Search through our vast collection of movies, series, actors, episodes, and more.",
        siteName: "MovieLandia24",
    },
    twitter: {
        card: "summary_large_image",
        site: "@movieLandia24",
        creator: "movieLandia24",
        title: "Search Movies, Series, Actors and More",
        description: "Search through our vast collection of movies, series, actors, episodes, and more.",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default async function Search(props: ISearchProps) {
    const session = await getServerSession(authOptions);

    const searchParams = await props.searchParams;
    const searchParamsKey = JSON.stringify(searchParams);

    return (
        <Suspense key={searchParamsKey} fallback={<LoadingSpinner />}>
            <SearchPageContent searchParams={searchParams} session={session} />
        </Suspense>
    );
}
