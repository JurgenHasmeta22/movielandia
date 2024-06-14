import GenreItem from "@/components/genreItem/GenreItem";
import genreService from "@/services/genreService";
import { Box, Container, Typography } from "@mui/material";
import { Genre } from "@prisma/client";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Watch the Latest Genres | High-Quality and Always Updated",
    description:
        "Discover and watch the latest and most amazing genres in high quality. Our collection is always updated with the newest episodes and releases.",
};

export default async function Genres() {
    const genresData = await genreService.getGenres({});
    const genres = genresData!.rows!;

    return (
        <Container>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    placeItems: "center",
                    paddingTop: 4,
                }}
                component={"section"}
            >
                <Typography mt={4} fontSize={"30px"}>
                    Choose your favorite genre
                </Typography>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr 1fr",
                        rowGap: 6,
                        columnGap: 4,
                    }}
                    mb={6}
                    mt={4}
                >
                    {genres?.map((genre: Genre, index: number) => <GenreItem key={index} genre={genre} />)}
                </Box>
            </Box>
        </Container>
    );
}
