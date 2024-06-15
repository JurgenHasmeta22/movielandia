import React from "react";
import { AppBar, Box, List, ListItem, Stack, Toolbar, Typography } from "@mui/material";
import MovieIcon from "@mui/icons-material/Movie";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import dynamic from "next/dynamic";

// Dynamically import the client-side components
const ThemeToggleButton = dynamic(() => import("@/components/themeToggleButton/ThemeToggleButton"), { ssr: false });
const AuthButtons = dynamic(() => import("@/components/authButtons/AuthButtons"), { ssr: false });
const SearchField = dynamic(() => import("@/components/searchField/SearchField"), { ssr: false });

const Header = () => (
    <>
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
                        <Typography
                            component={"a"}
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
                        </Typography>
                    </Box>
                    <Box>
                        <List sx={{ display: "flex", flexDirection: "row", columnGap: 2 }}>
                            <ListItem>
                                <Typography
                                    component="a"
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
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <Typography
                                    component="a"
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
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <Typography
                                    component="a"
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
                                </Typography>
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
    </>
);

export default Header;
