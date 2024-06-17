import GenreItem from "@/components/genreItem/GenreItem";
import { getGenres } from "@/lib/actions/genre.action";
import { Box, Container, Typography } from "@mui/material";
import { Genre } from "@prisma/client";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Watch the Latest Genres | High-Quality and Always Updated",
    description:
        "Discover and watch the latest and most amazing genres in high quality. Our collection is always updated with the newest episodes and releases.",
    openGraph: {
        type: "video.tv_show",
        url: "https://movielandia24.com/genres",
        title: "Watch the Latest Genres | High-Quality and Always Updated",
        description:
            "Discover and watch the latest and most amazing genres in high quality. Our collection is always updated with the newest episodes and releases.",
        // images: photoSrc
        //     ? [
        //           {
        //               url: photoSrc,
        //               width: 200,
        //               height: 300,
        //               alt: description,
        //           },
        //       ]
        //     : [],
        siteName: "MovieLandia24",
    },
    twitter: {
        card: "summary_large_image",
        site: "@movieLandia24",
        creator: "movieLandia24",
        title: "Watch the Latest Genres | High-Quality and Always Updated",
        description:
            "Discover and watch the latest and most amazing genres in high quality. Our collection is always updated with the newest episodes and releases.",
        // images: photoSrc
        //     ? [
        //           {
        //               url: photoSrc,
        //               alt: description,
        //           },
        //       ]
        //     : [],
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default async function Genres() {
    const genresData = await getGenres({});
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
