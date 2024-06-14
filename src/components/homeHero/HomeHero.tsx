import { Typography, Button, Box } from "@mui/material";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import MovieIcon from "@mui/icons-material/Movie";
import Link from "next/link";

const HomeHeroSection = () => {
    return (
        <Box
            display={"flex"}
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            rowGap={0.5}
            component={"section"}
            sx={{
                height: "100vh",
                position: "relative",
                overflow: "hidden",
                textAlign: "center",
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundImage: "url('/images/backgrounds/netflix.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    zIndex: -1,
                }}
            />
            <Typography variant="h1" fontSize={[22, 30, 40, 55, 60]} fontWeight={900} letterSpacing={3}>
                Dive into MovieLandia24
            </Typography>
            <Typography
                variant="h2"
                textAlign={"center"}
                fontSize={[16, 22, 30, 35, 40]}
                fontWeight={900}
                letterSpacing={1}
            >
                Your Gateway to the World of Cinema and Series!
            </Typography>
            <Box marginTop={1}>
                <Typography
                    variant="body1"
                    textAlign={"center"}
                    fontWeight={700}
                    letterSpacing={0.5}
                    sx={{
                        fontSize: [12, 14, 16, 18, 20],
                    }}
                >
                    Explore the latest blockbusters and timeless classics.
                </Typography>
            </Box>
            <Box display="flex" justifyContent="center" marginTop={2} columnGap={3}>
                <Link href={"/movies"}>
                    <Button
                        variant="contained"
                        sx={{
                            textTransform: "capitalize",
                        }}
                    >
                        <MovieIcon
                            sx={{
                                fontSize: [12, 14, 16, 18, 20],
                            }}
                        />
                        <Typography
                            component={"span"}
                            paddingLeft={1}
                            fontWeight={800}
                            sx={{
                                fontSize: [10, 12, 14, 16, 18],
                                py: 0.5,
                            }}
                        >
                            Start Watching Movies
                        </Typography>
                    </Button>
                </Link>
                <Link href={"/series"}>
                    <Button
                        variant="contained"
                        sx={{
                            textTransform: "capitalize",
                        }}
                    >
                        <LocalMoviesIcon
                            sx={{
                                fontSize: [12, 14, 16, 18, 20],
                            }}
                        />
                        <Typography
                            component={"span"}
                            paddingLeft={1}
                            fontWeight={700}
                            sx={{
                                fontSize: [10, 12, 14, 16, 18],
                                py: 0.5,
                            }}
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
