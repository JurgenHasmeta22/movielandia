import GenreItem from "@/components/root/ui/genreItem/GenreItem";
import { getGenres } from "@/actions/genre.actions";
import { Typography } from "@mui/material";
import { Genre } from "@prisma/client";
import type { Metadata } from "next";
import Box from "@mui/material-pigment-css/Box";
import Stack from "@mui/material-pigment-css/Stack";

const baseUrl = process.env.NEXT_PUBLIC_PROJECT_URL;

export const metadata: Metadata = {
    title: "Watch the Latest Genres | High-Quality and Always Updated",
    description:
        "Discover and watch the latest and most amazing genres in high quality. Our collection is always updated with the newest episodes and releases.",
    openGraph: {
        type: "video.tv_show",
        url: `${baseUrl}/genres`,
        title: "Watch the Latest Genres | High-Quality and Always Updated",
        description:
            "Discover and watch the latest and most amazing genres in high quality. Our collection is always updated with the newest episodes and releases.",
        siteName: "MovieLandia24",
    },
    twitter: {
        card: "summary_large_image",
        site: "@movieLandia24",
        creator: "movieLandia24",
        title: "Watch the Latest Genres | High-Quality and Always Updated",
        description:
            "Discover and watch the latest and most amazing genres in high quality. Our collection is always updated with the newest episodes and releases.",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default async function Genres() {
    const genresData = await getGenres({});
    const genres = genresData.rows;

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                placeItems: "center",
                paddingTop: 4,
                marginTop: 4,
                marginBottom: 4,
                marginRight: 3,
                marginLeft: 3,
            }}
            component={"section"}
        >
            <Typography
                sx={{
                    marginTop: 4,
                }}
                fontSize={"26px"}
            >
                Choose your favorite genre
            </Typography>
            <Stack
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignItems: "start",
                    rowGap: 4,
                    columnGap: 3,
                    marginTop: 3,
                    marginBottom: 4,
                    justifyContent: "start",
                    // justifyContent: {
                    //     xs: "center",
                    //     sm: "center",
                    //     md: "start",
                    //     lg: "start",
                    // },
                }}
            >
                {genres.map((genre: Genre, index: number) => (
                    <GenreItem key={index} genre={genre} />
                ))}
            </Stack>
        </Box>
    );
}
