import React, { Suspense } from "react";
import { Metadata } from "next";
import { Genre } from "@prisma/client";
import { getGenreById } from "@/actions/genre.actions";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import GenrePageContent from "./_components/GenrePageContent";
import LoadingSkeletonGenre from "@/components/root/loadingSkeleton/LoadingSkeletonGenre";

interface IGenreProps {
    params: {
        genreId: string;
        genreName: string;
    };
    searchParams?: Promise<{
        moviesAscOrDesc?: string;
        pageMovies?: string;
        moviesSortBy?: string;
        seriesAscOrDesc?: string;
        pageSeries?: string;
        seriesSortBy?: string;
    }>;
}

export async function generateMetadata(props: IGenreProps): Promise<Metadata> {
    const params = await props.params;
    const { genreId } = params;

    let genre: Genre;
    let genreData: any;

    try {
        genreData = await getGenreById(Number(genreId), { type: "movie" });
        genre = genreData.genre;
    } catch (error) {
        return notFound();
    }

    const pageUrl = `${process.env.NEXT_PUBLIC_PROJECT_URL}/genres/${genre.id}/${genre.name}}`;

    return {
        title: `${genre.name} | Watch the Latest Movies and Series of the genre`,
        description: `Discover and watch the latest and most amazing movies and series of genre titled "${genre.name}" in high quality. Our collection is always updated with the newest releases.`,
        openGraph: {
            type: "video.tv_show",
            url: pageUrl,
            title: `${genre.name} | Genre`,
            description: `Discover and watch the latest and most amazing movies and series of genre titled "${genre.name}" in high quality. Our collection is always updated with the newest releases.`,
            siteName: "MovieLandia24",
        },
        twitter: {
            card: "summary_large_image",
            site: "@movieLandia24",
            creator: "movieLandia24",
            title: `${genre.name} | Genre`,
            description: `Discover and watch the latest and most amazing movies and series of genre titled "${genre.name}" in high quality. Our collection is always updated with the newest releases.`,
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function GenrePage(props: IGenreProps): Promise<React.JSX.Element> {
    const session = await getServerSession(authOptions);

    const searchParams = await props.searchParams;
    const searchParamsKey = JSON.stringify(searchParams);

    return (
        <Suspense key={searchParamsKey} fallback={<LoadingSkeletonGenre />}>
            <GenrePageContent params={props.params} searchParams={searchParams} session={session} />
        </Suspense>
    );
}
