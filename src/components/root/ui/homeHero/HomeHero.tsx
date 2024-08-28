"use client";

import { Typography, Button, Box, useTheme } from "@mui/material";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import MovieIcon from "@mui/icons-material/Movie";
import Link from "next/link";
import Image from "next/image";
import type {} from "@mui/material/themeCssVarsAugmentation";

const HomeHeroSection = () => {
    const theme = useTheme();

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            component="section"
            sx={{
                height: "100vh",
                position: "relative",
                textAlign: "center",
                overflow: "hidden",
                rowGap: 1,
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: -1,
                }}
            >
                <Image
                    src="/images/backgrounds/netflix.png"
                    alt="Background Image"
                    fill
                    priority
                    style={{
                        objectFit: "cover",
                    }}
                />
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                    }}
                />
            </Box>

            <Typography
                variant="h1"
                fontSize={[24, 36, 48, 64]}
                fontWeight={900}
                letterSpacing={2}
                sx={{
                    zIndex: 1,
                    color: "#fff",
                    paddingX: 2,
                }}
            >
                Dive into MovieLandia24
            </Typography>
            <Typography
                variant="h2"
                fontSize={[18, 24, 32, 40]}
                fontWeight={700}
                letterSpacing={1}
                sx={{
                    zIndex: 1,
                    color: "#fff",
                    paddingX: 2,
                    mt: 1,
                }}
            >
                Your Gateway to the World of Cinema!
            </Typography>
            <Box sx={{ zIndex: 1, marginTop: 1 }}>
                <Typography
                    variant="body1"
                    fontSize={[14, 16, 18, 20]}
                    fontWeight={600}
                    sx={{
                        color: "#fff",
                        paddingX: 2,
                    }}
                >
                    Explore the latest blockbusters and timeless classics.
                </Typography>
            </Box>
            <Box
                display="flex"
                justifyContent="center"
                marginTop={3}
                columnGap={2}
                sx={{ zIndex: 1 }}
                flexWrap={"wrap"}
            >
                <Link href="/movies" passHref style={{ textDecoration: "none" }}>
                    <Button
                        variant="contained"
                        sx={{
                            textTransform: "capitalize",
                            backgroundColor: theme.vars.palette.primary.dark,
                            "&:hover": {
                                backgroundColor: theme.vars.palette.green.main,
                            },
                            display: "flex",
                            alignItems: "center",
                            padding: "10px 20px",
                        }}
                    >
                        <MovieIcon sx={{ color: theme.vars.palette.primary.main, fontSize: 20 }} />
                        <Typography
                            component="span"
                            paddingLeft={1}
                            fontWeight={800}
                            sx={{ color: theme.vars.palette.primary.main, fontSize: 16 }}
                        >
                            Start Watching Movies
                        </Typography>
                    </Button>
                </Link>
                <Link href="/series" passHref style={{ textDecoration: "none" }}>
                    <Button
                        variant="contained"
                        sx={{
                            textTransform: "capitalize",
                            backgroundColor: theme.vars.palette.primary.dark,
                            "&:hover": {
                                backgroundColor: theme.vars.palette.green.main,
                            },
                            display: "flex",
                            alignItems: "center",
                            padding: "10px 20px",
                        }}
                    >
                        <LocalMoviesIcon sx={{ color: theme.vars.palette.primary.main, fontSize: 20 }} />
                        <Typography
                            component="span"
                            paddingLeft={1}
                            fontWeight={700}
                            sx={{ color: theme.vars.palette.primary.main, fontSize: 16 }}
                        >
                            Start Watching Series
                        </Typography>
                    </Button>
                </Link>
            </Box>
        </Box>
    );
};

export default HomeHeroSection;
