import { Suspense } from "react";
import { Metadata } from "next";
import { getGenreById } from "@/actions/genre.actions";
import { Genre } from "@prisma/client";
import { notFound } from "next/navigation";
import GenrePageByName from "./[genreName]/page";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";

export async function generateMetadata(props: {
    params: Promise<{ genreId: string; genreName: string }>;
}): Promise<Metadata> {
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

    const pageUrl = `${process.env.NEXT_PUBLIC_PROJECT_URL}/genres/${genre.name}`;

    return {
        title: `${genre.name} | Genre`,
        description: `${genre.name}`,
        openGraph: {
            type: "video.tv_show",
            url: pageUrl,
            title: `${genre.name} | Genre`,
            siteName: "MovieLandia24",
        },
        twitter: {
            card: "summary_large_image",
            site: "@movieLandia24",
            creator: "movieLandia24",
            title: `${genre.name} | Genre`,
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function GenrePageById(props: { params: Promise<{ genreId: string; genreName: string }> }) {
    const params = await props.params;
    const paramsKey = JSON.stringify(params);

    return (
        <Suspense key={paramsKey} fallback={<LoadingSpinner />}>
            <GenrePageByName params={params} />
        </Suspense>
    );
}
