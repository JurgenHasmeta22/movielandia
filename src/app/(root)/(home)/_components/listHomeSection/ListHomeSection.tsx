import CardItem from "@/components/root/cardItem/CardItem";
import GenreItem from "@/components/root/genreItem/GenreItem";
import { Box, Stack, Typography } from "@mui/material";
import { Genre, Movie, Serie } from "@prisma/client";
import NextLink from "next/link";

interface IListHomeSectionProps {
    data: Array<Movie | Serie | Genre>;
    type: "genre" | "movie" | "serie";
    link: string;
    linkText: string;
    path?: string;
}

const ListHomeSection: React.FC<IListHomeSectionProps> = ({ data, type, link, linkText, path }) => {
    return (
        <Box
            component={"section"}
            sx={{
                py: { xs: 3, md: 4 },
                px: { xs: 2, sm: 3, md: 4 },
            }}
        >
            <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                sx={{
                    mb: { xs: 3, md: 4 },
                }}
            >
                <Typography
                    variant="h2"
                    sx={{
                        fontWeight: 800,
                        fontSize: { xs: 24, sm: 28, md: 32 },
                        color: "text.primary",
                        position: "relative",
                        display: "inline-block",
                        "&::after": {
                            content: '""',
                            position: "absolute",
                            bottom: -8,
                            left: 0,
                            width: "100%",
                            height: 3,
                            backgroundColor: "primary.main",
                            borderRadius: 1,
                        },
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
                <NextLink
                    href={link}
                    style={{
                        textDecoration: "none",
                        color: "inherit",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        transition: "all 0.2s ease",
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: 700,
                            fontSize: { xs: 14, sm: 16 },
                            color: "primary.main",
                            transition: "opacity 0.2s ease",
                            "&:hover": {
                                opacity: 0.8,
                            },
                        }}
                    >
                        {linkText}
                    </Typography>
                </NextLink>
            </Stack>

            <Box
                sx={{
                    width: "100%",
                    overflow: "hidden",
                }}
            >
                <Stack
                    direction="row"
                    flexWrap="wrap"
                    sx={{
                        gap: { xs: 2, sm: 3, md: 4 },
                        justifyContent: {
                            xs: "center",
                            sm: "center",
                            md: "flex-start",
                        },
                        mx: "auto",
                    }}
                >
                    {data &&
                        data.length > 0 &&
                        data.map((item: Movie | Genre | Serie) =>
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
