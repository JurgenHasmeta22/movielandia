import { getLatestMovies, getMovieById, getRelatedMovies } from "@/actions/movie.actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Movie } from "@prisma/client";
import MoviePageContent from "./_components/MoviePageContent";
import LoadingSpinner from "@/components/root/loadingSpinner/LoadingSpinner";
import { Suspense } from "react";

interface IMoviePageProps {
    params: {
        movieId: string;
    };
    searchParams?: Promise<{
        reviewsAscOrDesc: string | undefined;
        reviewsPage: string;
        reviewsSortBy: string;
        crewPage: string;
        castPage: string;
    }>;
}

export async function generateMetadata(props: IMoviePageProps): Promise<Metadata> {
    const params = await props.params;
    const { movieId } = params;

    let movie: Movie | null = null;

    try {
        movie = await getMovieById(Number(movieId), {});
    } catch (error) {
        return notFound();
    }

    const { description, photoSrcProd } = movie!;

    const pageUrl = `${process.env.NEXT_PUBLIC_PROJECT_URL}/movies/${movie?.title}`;

    return {
        title: `${movie?.title} | Movie`,
        description: `${movie?.description}`,
        openGraph: {
            type: "video.other",
            url: pageUrl,
            title: `${movie?.title} | Movie`,
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
            title: `${movie?.title} | Movie`,
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

export default async function MoviePage(props: IMoviePageProps) {
    const session = await getServerSession(authOptions);

    const params = await props.params;
    const movieId = params.movieId;

    const searchParams = await props.searchParams;
    const searchParamsKey = JSON.stringify(searchParams);

    const reviewsAscOrDesc = searchParams && searchParams.reviewsAscOrDesc;
    const reviewsSortBy = searchParams && searchParams.reviewsSortBy ? searchParams.reviewsSortBy : "";
    const reviewsPage = searchParams?.reviewsPage ? Number(searchParams.reviewsPage) : 1;

    const castPage = searchParams?.castPage ? Number(searchParams.castPage) : 1;
    const crewPage = searchParams?.crewPage ? Number(searchParams.crewPage) : 1;

    const searchParamsValues = {
        reviewsAscOrDesc,
        reviewsPage,
        reviewsSortBy,
        castPage,
        crewPage,
        userId: Number(session?.user?.id),
    };

    let movie = null;

    try {
        movie = await getMovieById(Number(movieId), searchParamsValues);
    } catch (error) {
        return notFound();
    }

    const relatedMovies = await getRelatedMovies(Number(movieId), Number(session?.user?.id));

    const reviewsPageCount = Math.ceil(movie.totalReviews / 5);
    const castPageCount = Math.ceil(movie.totalCast / 5);
    const crewPageCount = Math.ceil(movie.totalCrew / 5);

    return (
        <Suspense key={searchParamsKey} fallback={<LoadingSpinner />}>
            <MoviePageContent
                searchParamsValues={{
                    reviewsAscOrDesc,
                    reviewsPage: Number(reviewsPage),
                    reviewsSortBy,
                    castPage: Number(castPage) || 1,
                    crewPage: Number(crewPage) || 1,
                }}
                movie={movie}
                relatedMovies={relatedMovies}
                reviewsPageCount={reviewsPageCount}
                castPageCount={castPageCount}
                crewPageCount={crewPageCount}
            />
        </Suspense>
    );
}
