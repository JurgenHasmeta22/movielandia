import { Typography } from "@mui/material";
import { Actor, Genre, Movie, Serie } from "@prisma/client";
import Link from "next/link";
import CardItem from "../cardItem/CardItem";
import GenreItem from "../genreItem/GenreItem";
import Box from "@mui/material-pigment-css/Box";
import Stack from "@mui/material-pigment-css/Stack";

interface IListHomeSectionProps {
    data: Array<Movie | Serie | Actor | Genre>;
    type: "genre" | "movie" | "serie" | "actor";
    link: string;
    linkText: string;
    path?: string;
}

const ListHomeSection: React.FC<IListHomeSectionProps> = ({ data, type, link, linkText, path }) => {
    return (
        <Box
            component={"section"}
            sx={{
                display: "flex",
                flexDirection: "column",
                rowGap: 2,
            }}
        >
            <Stack
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginLeft: 3,
                    marginRight: 5,
                }}
            >
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
            <Box sx={{ paddingLeft: 5, paddingRight: 3 }}>
                <Stack
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        alignItems: "start",
                        rowGap: 5,
                        columnGap: 5,
                        // justifyContent: {
                        //     xs: "center",
                        //     sm: "center",
                        //     md: "start",
                        //     lg: "start",
                        // },
                        justifyContent: "start",
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
