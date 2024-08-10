import { getLatestMovies, getMovieById, getRelatedMovies } from "@/actions/movie.actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import MoviePage from "./_components/MoviePage";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Movie } from "@prisma/client";

interface IMovieProps {
    params: {
        movieId: string;
    };
    searchParams?: { moviesAscOrDesc?: string; page?: string; moviesSortBy?: string };
}

export async function generateMetadata({ params }: IMovieProps): Promise<Metadata> {
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

export default async function MovieDetails({ searchParams, params }: IMovieProps) {
    const session = await getServerSession(authOptions);

    const movieId = params.movieId;
    const ascOrDesc = searchParams?.moviesAscOrDesc;
    const page = searchParams?.page ? Number(searchParams!.page!) : 1;
    const sortBy = searchParams?.moviesSortBy ? searchParams?.moviesSortBy : "";
    const searchParamsValues = {
        ascOrDesc,
        page,
        sortBy,
    };

    let movie = null;

    try {
        movie = await getMovieById(Number(movieId), { userId: Number(session?.user?.id) });
    } catch (error) {
        return notFound();
    }

    const latestMovies = await getLatestMovies();
    const relatedMovies = await getRelatedMovies(Number(movieId));

    const pageCount = Math.ceil(movie?.totalReviews / 5);

    return (
        <MoviePage
            searchParamsValues={searchParamsValues}
            movie={movie}
            latestMovies={latestMovies}
            relatedMovies={relatedMovies}
            pageCount={pageCount}
        />
    );
}
