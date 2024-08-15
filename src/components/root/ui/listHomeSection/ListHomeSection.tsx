import { Box, Stack, Typography } from "@mui/material";
import { Actor, Genre, Movie, Serie } from "@prisma/client";
import Link from "next/link";
import CardItem from "../cardItem/CardItem";
import GenreItem from "../genreItem/GenreItem";

interface IListHomeSectionProps {
    data: Array<Movie | Serie | Actor | Genre>;
    type: "genre" | "movie" | "serie" | "actor";
    link: string;
    linkText: string;
    path?: string;
}

const ListHomeSection: React.FC<IListHomeSectionProps> = ({ data, type, link, linkText, path }) => {
    return (
        <Box display={"flex"} flexDirection={"column"} rowGap={2} component={"section"}>
            <Stack flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"} ml={3} mr={5}>
                <Typography
                    sx={{
                        fontWeight: 700,
                        fontSize: 28,
                    }}
                >
                    {type === "genre"
                        ? "Trending Genres"
                        : type === "movie"
                          ? "Trending Movies"
                          : type === "serie"
                            ? "Trending Series"
                            : type === "actor"
                              ? "Trending Actors"
                              : ""}
                </Typography>
                <Link
                    href={link}
                    style={{
                        textDecoration: "none",
                        fontWeight: 900,
                        fontSize: 14,
                    }}
                >
                    {linkText}
                </Link>
            </Stack>
            <Box pr={3} pl={5}>
                <Stack
                    direction="row"
                    flexWrap="wrap"
                    alignItems={"start"}
                    rowGap={5}
                    columnGap={5}
                    sx={{
                        justifyContent: {
                            xs: "center",
                            sm: "center",
                            md: "start",
                            lg: "start",
                        },
                    }}
                >
                    {data &&
                        data.length > 0 &&
                        data.map((item: Movie | Genre | Serie | Actor) =>
                            type === "genre" ? (
                                <GenreItem key={item.id} genre={item as Genre} />
                            ) : (
                                <CardItem data={item} key={item.id} type={type} path={path!} />
                            ),
                        )}
                </Stack>
            </Box>
        </Box>
    );
};

export default ListHomeSection;
