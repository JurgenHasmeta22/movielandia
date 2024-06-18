import { Container } from "@mui/material";
import { getLatestMovies, getMovieByTitle, getRelatedMovies } from "@/lib/actions/movie.action";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Movie as IMovie } from "@prisma/client";
import MoviePageDetails from "./MoviePageDetails";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface IMovieProps {
    params: {
        title: string;
    };
    searchParams?: { moviesAscOrDesc?: string; page?: string; moviesSortBy?: string };
}

export async function generateMetadata({ params }: IMovieProps): Promise<Metadata> {
    const { title } = params;
    const movie: IMovie = await getMovieByTitle(title, {});

    if (!movie) return notFound();

    const { description, photoSrc } = movie;
    const siteUrl = "https://movielandia24.com";
    const pageUrl = `${siteUrl}/movies/${title}`;

    return {
        title: `${title} | Movie`,
        description: `${movie.description}`,
        openGraph: {
            type: "video.other",
            url: pageUrl,
            title: `${title} | Movie`,
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
            title: `${title} | Movie`,
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

export default async function Movie({ searchParams, params }: IMovieProps) {
    const title = params?.title;

    const ascOrDesc = searchParams?.moviesAscOrDesc;
    const page = searchParams?.page ? Number(searchParams!.page!) : 1;
    const sortBy = searchParams?.moviesSortBy ? searchParams?.moviesSortBy : "";
    const searchParamsValues = {
        ascOrDesc,
        page,
        sortBy,
    };

    const session = await getServerSession(authOptions);
    console.log(session);

    const movie = await getMovieByTitle(title, { userId: Number(session?.user?.id) });
    const latestMovies = await getLatestMovies();
    const relatedMovies = await getRelatedMovies(title);

    const pageCount = Math.ceil(movie?.totalReviews / 5);

    return (
        <Container>
            <MoviePageDetails
                searchParamsValues={searchParamsValues}
                movie={movie}
                latestMovies={latestMovies}
                relatedMovies={relatedMovies}
                pageCount={pageCount}
            />
        </Container>
    );
}
