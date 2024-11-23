"use client";

import { Typography, Button, Box } from "@mui/material";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import MovieIcon from "@mui/icons-material/Movie";
import Link from "next/link";
import Image from "next/image";

const HomeHeroSection = () => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            component="section"
            sx={{
                minHeight: { xs: "90vh", md: "100vh" },
                position: "relative",
                textAlign: "center",
                overflow: "hidden",
                py: { xs: 6, md: 0 },
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
                    "&::after": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)",
                    },
                }}
            >
                <Image
                    src="/images/backgrounds/netflix.png"
                    alt="Background Image"
                    fill
                    priority
                    style={{
                        objectFit: "cover",
                        objectPosition: "center",
                    }}
                />
            </Box>
            <Box
                sx={{
                    maxWidth: { xs: "95%", sm: "85%", md: "75%" },
                    mx: "auto",
                    zIndex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: { xs: 2, md: 2.5 },
                }}
            >
                <Typography
                    variant="h1"
                    fontSize={{ xs: 36, sm: 48, md: 64, lg: 72 }}
                    fontWeight={900}
                    letterSpacing={{ xs: 1, md: 2 }}
                    sx={{
                        color: "#fff",
                        textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                        lineHeight: 1.1,
                        mb: { xs: 0.5, md: 1 },
                    }}
                >
                    Dive into MovieLandia24
                </Typography>
                <Typography
                    variant="h2"
                    fontSize={{ xs: 22, sm: 28, md: 36, lg: 42 }}
                    fontWeight={700}
                    letterSpacing={{ xs: 0.5, md: 1 }}
                    sx={{
                        color: "#fff",
                        textShadow: "1px 1px 3px rgba(0,0,0,0.4)",
                        lineHeight: 1.2,
                        mb: { xs: 1, md: 1.5 },
                        opacity: 0.95,
                    }}
                >
                    Your Gateway to the World of Cinema!
                </Typography>
                <Typography
                    variant="body1"
                    fontSize={{ xs: 16, sm: 18, md: 20 }}
                    fontWeight={500}
                    sx={{
                        color: "grey.100",
                        maxWidth: { xs: "100%", md: "80%" },
                        mx: "auto",
                        mb: { xs: 2.5, md: 3 },
                        opacity: 0.9,
                    }}
                >
                    Explore the latest blockbusters and timeless classics in our curated collection of movies and
                    series.
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        gap: { xs: 2, md: 3 },
                        justifyContent: "center",
                        flexWrap: "wrap",
                        mt: { xs: 0.5, md: 1 },
                    }}
                >
                    <Button
                        component={Link}
                        href="/movies"
                        variant="outlined"
                        size="large"
                        startIcon={<LocalMoviesIcon />}
                        sx={{
                            px: { xs: 3, md: 4 },
                            py: { xs: 1.5, md: 2 },
                            fontSize: { xs: 16, md: 18 },
                            fontWeight: 700,
                            borderRadius: 2,
                            textTransform: "none",
                            borderWidth: 2,
                            color: "common.white",
                            borderColor: "common.white",
                            backdropFilter: "blur(4px)",
                            backgroundColor: "rgba(255,255,255,0.05)",
                            "&:hover": {
                                borderWidth: 2,
                                transform: "translateY(-2px)",
                                boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                                backgroundColor: "rgba(255,255,255,0.1)",
                            },
                        }}
                    >
                        Explore Movies
                    </Button>
                    <Button
                        component={Link}
                        href="/series"
                        variant="outlined"
                        size="large"
                        startIcon={<MovieIcon />}
                        sx={{
                            px: { xs: 3, md: 4 },
                            py: { xs: 1.5, md: 2 },
                            fontSize: { xs: 16, md: 18 },
                            fontWeight: 700,
                            borderRadius: 2,
                            textTransform: "none",
                            borderWidth: 2,
                            color: "common.white",
                            borderColor: "common.white",
                            backdropFilter: "blur(4px)",
                            backgroundColor: "rgba(255,255,255,0.05)",
                            "&:hover": {
                                borderWidth: 2,
                                transform: "translateY(-2px)",
                                boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                                backgroundColor: "rgba(255,255,255,0.1)",
                            },
                        }}
                    >
                        Browse Series
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default HomeHeroSection;
