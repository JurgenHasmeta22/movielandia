import React from "react";
import { AppBar, Box, List, ListItem, Stack, Toolbar } from "@mui/material";
import MovieIcon from "@mui/icons-material/Movie";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import AuthButtons from "../authButtons/AuthButtons";
import SearchField from "../searchField/SearchField";
import ThemeToggleButton from "../themeToggleButton/ThemeToggleButton";
import Link from "next/link";

const Header = () => (
    <AppBar position="fixed" component={"header"}>
        <Toolbar
            sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                flexWrap: "wrap",
                py: 2,
            }}
            component={"nav"}
        >
            <Stack
                flexDirection={"row"}
                alignItems={"center"}
                justifyContent={"space-around"}
                columnGap={3}
                flexWrap={"wrap"}
            >
                <Box>
                    <Link
                        href={"/"}
                        style={{
                            cursor: "pointer",
                            textDecoration: "none",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            fontSize: 20,
                        }}
                    >
                        MovieLandia24
                    </Link>
                </Box>
                <Box>
                    <List sx={{ display: "flex", flexDirection: "row", columnGap: 2 }}>
                        <ListItem>
                            <Link
                                href="/movies"
                                style={{
                                    fontSize: "16px",
                                    textDecoration: "none",
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <MovieIcon fontSize={"large"} />
                                Movies
                            </Link>
                        </ListItem>
                        <ListItem>
                            <Link
                                href="/genres"
                                style={{
                                    fontSize: "16px",
                                    textDecoration: "none",
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <SubtitlesIcon fontSize={"large"} />
                                Genres
                            </Link>
                        </ListItem>
                        <ListItem>
                            <Link
                                href="/series"
                                style={{
                                    fontSize: "16px",
                                    textDecoration: "none",
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <LocalMoviesIcon fontSize={"large"} />
                                Series
                            </Link>
                        </ListItem>
                    </List>
                </Box>
                <Box sx={{ display: "flex", placeItems: "center", columnGap: 1 }}>
                    <SearchField />
                    <ThemeToggleButton />
                    <AuthButtons />
                </Box>
            </Stack>
        </Toolbar>
    </AppBar>
);

export default Header;
