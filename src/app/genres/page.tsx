import GenreItem from "@/components/genreItem/GenreItem";
import genreService from "@/services/genreService";
import { Box, Container, Typography } from "@mui/material";
import { Genre } from "@prisma/client";

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
