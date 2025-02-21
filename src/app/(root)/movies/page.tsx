import { Suspense } from "react";
import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import MoviesPageContent from "./_components/MoviesPageContent";
import LoadingSkeletonWithLatest from "@/components/root/loadingSkeleton/LoadingSkeletonWithLatest";

interface IMoviesProps {
    searchParams?: Promise<{ moviesAscOrDesc?: string; page?: string; moviesSortBy?: string }>;
}

export const metadata: Metadata = {
    title: "Movies | MovieLandia",
    description: "Explore our vast collection of movies on MovieLandia",
    keywords: ["movies", "watch movies", "movie streaming", "online movies", "MovieLandia movies", "latest movies"],
    openGraph: {
        title: "Movies | MovieLandia",
        description: "Explore our vast collection of movies on MovieLandia",
        type: "website",
        locale: "en_US",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default async function Movies(props: IMoviesProps) {
    const session = await getServerSession(authOptions);

    const searchParams = await props.searchParams;
    const searchParamsKey = JSON.stringify(searchParams);

    return (
        <Suspense key={searchParamsKey} fallback={<LoadingSkeletonWithLatest />}>
            <MoviesPageContent searchParams={searchParams} session={session} />
        </Suspense>
    );
}
