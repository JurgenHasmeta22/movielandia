"use client";

import CardItem from "@/components/root/cardItem/CardItem";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { Genre, Movie, Serie } from "@prisma/client";
import NextLink from "next/link";
import type {} from "@mui/material/themeCssVarsAugmentation";

type MovieWithBookmark = Movie & {
    isBookmarked?: boolean;
};

type SerieWithBookmark = Serie & {
    isBookmarked?: boolean;
};

interface IListHomeSectionProps {
    data: Array<MovieWithBookmark | SerieWithBookmark | Genre>;
    type: "movie" | "serie";
    link: string;
    linkText: string;
    path?: string;
}

const ListHomeSection = ({ data, type, link, linkText, path }: IListHomeSectionProps) => {
    const theme = useTheme();

    const getSectionTitle = () => {
        switch (type) {
            case "movie":
                return "Trending Movies";
            case "serie":
                return "Trending Series";
            default:
                return "";
        }
    };

    const transformItemToCardData = (item: MovieWithBookmark | SerieWithBookmark | Genre) => {
        if (type === "movie") {
            const movieData = item as MovieWithBookmark;

            return {
                id: movieData.id,
                photoSrcProd: movieData.photoSrcProd,
                description: movieData.description,
                title: movieData.title,
                ratingImdb: movieData.ratingImdb,
                dateAired: movieData.dateAired,
                isBookmarked: movieData.isBookmarked,
            };
        } else if (type === "serie") {
            const serieData = item as SerieWithBookmark;

            return {
                id: serieData.id,
                photoSrcProd: serieData.photoSrcProd,
                description: serieData.description,
                title: serieData.title,
                ratingImdb: serieData.ratingImdb,
                dateAired: serieData.dateAired,
                isBookmarked: serieData.isBookmarked,
            };
        }

        return null;
    };

    return (
        <Box
            component="section"
            sx={{
                py: { xs: 3, md: 4 },
                px: { xs: 2, sm: 3, md: 4 },
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: { xs: 1, md: 2 } }}>
                <Typography
                    variant="h2"
                    sx={{
                        fontWeight: 800,
                        fontSize: { xs: 24, sm: 28, md: 32 },
                        color: theme.vars.palette.text.primary,
                        position: "relative",
                        display: "inline-block",
                        "&::after": {
                            content: '""',
                            position: "absolute",
                            bottom: -8,
                            left: 0,
                            width: "100%",
                            height: 3,
                            backgroundColor: theme.vars.palette.primary.main,
                            borderRadius: 1,
                        },
                    }}
                >
                    {getSectionTitle()}
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
                            color: theme.vars.palette.primary.main,
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
                    mt: { xs: 4, md: 5 },
                }}
            >
                <Stack
                    direction="row"
                    flexWrap="wrap"
                    sx={{
                        columnGap: { xs: 1, sm: 2, md: 3 },
                        rowGap: { xs: 3, sm: 4, md: 5 },
                        justifyContent: {
                            xs: "center",
                            md: "flex-start",
                        },
                        mx: { xs: 1, sm: 2 },
                        mb: { xs: 3, md: 4 },
                    }}
                >
                    {data?.map((item, index) => {
                        const cardData = transformItemToCardData(item);

                        if (!cardData) {
                            return null;
                        }

                        return <CardItem key={index} data={cardData} type={type} path={path} />;
                    })}
                </Stack>
            </Box>
        </Box>
    );
};

export default ListHomeSection;
