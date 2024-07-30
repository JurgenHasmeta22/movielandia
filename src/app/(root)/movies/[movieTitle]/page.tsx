import { Container } from "@mui/material";
import { getLatestMovies, getMovieByTitle, getRelatedMovies } from "@/lib/actions/movie.actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import MoviePage from "./_components/MoviePage";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface IMovieProps {
    params: {
        movieTitle: string;
    };
    searchParams?: { moviesAscOrDesc?: string; page?: string; moviesSortBy?: string };
}

export async function generateMetadata({ params }: IMovieProps): Promise<Metadata> {
    const { movieTitle } = params;
    let movie = null;

    try {
        movie = await getMovieByTitle(movieTitle, {});
    } catch (error) {
        return notFound();
    }

    const { description, photoSrcProd } = movie;

    const pageUrl = `${process.env.NEXT_PUBLIC_PROJECT_URL}/movies/${movieTitle}`;

    return {
        title: `${movieTitle} | Movie`,
        description: `${movie.description}`,
        openGraph: {
            type: "video.other",
            url: pageUrl,
            title: `${movieTitle} | Movie`,
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
            title: `${movieTitle} | Movie`,
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

export default async function Movie({ searchParams, params }: IMovieProps) {
    const session = await getServerSession(authOptions);

    const title = params.movieTitle;

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
        movie = await getMovieByTitle(title, { userId: Number(session?.user?.id) });
    } catch (error) {
        return notFound();
    }

    const latestMovies = await getLatestMovies();
    const relatedMovies = await getRelatedMovies(title);

    const pageCount = Math.ceil(movie?.totalReviews / 5);

    return (
        <Container>
            <MoviePage
                searchParamsValues={searchParamsValues}
                movie={movie}
                latestMovies={latestMovies}
                relatedMovies={relatedMovies}
                pageCount={pageCount}
            />
        </Container>
    );
}
