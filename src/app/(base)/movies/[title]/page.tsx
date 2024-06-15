import { Box, Container, Stack } from "@mui/material";
import { DetailsPageCard } from "@/components/detailsPageCard/DetailsPageCard";
import PaginationControl from "@/components/paginationControl/PaginationControl";
import { ListDetail } from "@/components/listDetail/ListDetail";
import Review from "@/components/review/Review";
import Reviews from "@/components/reviews/Reviews";
import { getLatestMovies, getMovieByTitle, getRelatedMovies } from "@/lib/actions/movie.action";
import { Metadata } from "next";

interface IMovieProps {
    params: {
        title: string;
    };
    searchParams?: { moviesAscOrDesc?: string; page?: string; moviesSortBy?: string };
}

export async function generateMetadata({ params }: IMovieProps): Promise<Metadata> {
    const { title } = params;

    return {
        title: `${title} | Watch the Latest Movies`,
        description: `Discover and watch the latest and most amazing movies titled "${title}" in high quality. Our collection is always updated with the newest releases.`,
    };
}

export default async function Movie({ searchParams, params }: IMovieProps) {
    const title = params?.title;
    const ascOrDesc = searchParams?.moviesAscOrDesc;
    const page = searchParams?.page ? Number(searchParams!.page!) : 1;
    const sortBy = searchParams?.moviesSortBy ? searchParams?.moviesSortBy : "";

    const movie = await getMovieByTitle(title, {});
    const latestMovies = await getLatestMovies();
    const relatedMovies = await getRelatedMovies(title);

    const pageCount = Math.ceil(movie?.totalReviews / 5);

    return (
        <Container>
            <Stack flexDirection={"column"} rowGap={4}>
                <DetailsPageCard data={movie} type="movie" />
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        rowGap: 2,
                        mb: movie?.reviews!.length > 0 ? 4 : 0,
                    }}
                    component={"section"}
                >
                    {movie?.reviews!.length > 0 && <Reviews data={movie} sortBy={sortBy!} ascOrDesc={ascOrDesc!} />}
                    {movie?.reviews!.map((review: any, index: number) => (
                        <Review key={index} review={review} type="movie" data={movie} />
                    ))}
                    {movie?.totalReviews > 0 && <PaginationControl currentPage={Number(page)!} pageCount={pageCount} />}
                    {/* {user && (!movie.isReviewed) && <TextEditorForm review={review} rating={rating} />} */}
                </Box>
                <ListDetail data={latestMovies!} type="movie" roleData={"latest"} />
                <ListDetail data={relatedMovies!} type="movie" roleData="related" />
            </Stack>
        </Container>
    );
}