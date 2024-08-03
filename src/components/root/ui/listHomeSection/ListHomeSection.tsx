import { Box, Stack, Typography } from "@mui/material";
import { Genre } from "@prisma/client";
import Link from "next/link";
import CardItem from "../cardItem/CardItem";
import GenreItem from "../genreItem/GenreItem";

interface ListHomeSectionProps {
    data: any;
    type: "genre" | "movie" | "serie";
    link: string;
    linkText: string;
}

const ListHomeSection: React.FC<ListHomeSectionProps> = ({ data, type, link, linkText }) => {
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
            <Box pr={3} pl={3}>
                <Stack
                    direction="row"
                    flexWrap="wrap"
                    justifyContent={"flex-start"}
                    alignItems={"start"}
                    rowGap={4}
                    columnGap={3}
                >
                    {data &&
                        data.length > 0 &&
                        data.map((item: any) =>
                            type === "genre" ? (
                                <GenreItem key={item.id} genre={item as Genre} />
                            ) : (
                                <CardItem data={item} key={item.id} type={type} />
                            ),
                        )}
                </Stack>
            </Box>
        </Box>
    );
};

export default ListHomeSection;
