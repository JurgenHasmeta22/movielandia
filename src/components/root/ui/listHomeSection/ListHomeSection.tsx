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
        <Box display={"flex"} flexDirection={"column"} rowGap={3} component={"section"}>
            <Stack flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"} mr={1} ml={1}>
                <Typography
                    sx={{
                        fontWeight: 700,
                        fontSize: 24,
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
                        // color: "secondary",
                    }}
                >
                    {linkText}
                </Link>
            </Stack>
            <Stack
                direction="row"
                flexWrap="wrap"
                justifyContent={"center"}
                alignContent={"center"}
                rowGap={4}
                columnGap={4}
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
    );
};

export default ListHomeSection;
