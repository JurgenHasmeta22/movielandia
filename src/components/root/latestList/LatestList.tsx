"use client";

import { Box, Stack, Typography, useTheme } from "@mui/material";
import CardItem from "../cardItem/CardItem";
import { Movie, Serie } from "@prisma/client";
import type {} from "@mui/material/themeCssVarsAugmentation";

interface ILatestListProps {
    data: Array<Movie | Serie> | null;
    type: string;
}

export function LatestList({ data, type }: ILatestListProps) {
    const theme = useTheme();

    return (
        <Box
            component="section"
            sx={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "1200px",
                margin: "0 auto",
                width: "100%",
                px: { xs: 2, sm: 3, md: 4 },
                py: { xs: 3, md: 4 },
            }}
        >
            <Box
                sx={{
                    mb: { xs: 1, md: 2 },
                    display: "flex",
                    justifyContent: { xs: "center", md: "flex-start" },
                }}
            >
                <Typography
                    variant="h2"
                    sx={{
                        fontSize: { xs: 24, sm: 28, md: 32 },
                        fontWeight: 800,
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
                            bgcolor: theme.vars.palette.primary.main,
                            borderRadius: 1,
                        },
                    }}
                >
                    Latest {type}
                </Typography>
            </Box>

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
                    }}
                >
                    {data?.map((item) => (
                        <CardItem
                            key={item.id}
                            data={item}
                            type={type.toLowerCase() === "movies" ? "movie" : "serie"}
                        />
                    ))}
                </Stack>
            </Box>
        </Box>
    );
}

export default LatestList;
