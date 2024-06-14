import React from "react";
import {
    AppBar,
    Box,
    Button,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    Stack,
    TextField,
    Toolbar,
    Typography,
} from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { Clear, Search } from "@mui/icons-material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import MovieIcon from "@mui/icons-material/Movie";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import SubtitlesIcon from "@mui/icons-material/Subtitles";

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
                            variant="h6"
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
                        <TextField
                            placeholder="What are you going to watch today?"
                            size="small"
                            InputProps={{
                                color: "secondary",
                                sx: { py: 0.5 },
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Clear sx={{ cursor: "pointer" }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <IconButton>
                            <LightModeOutlinedIcon />
                        </IconButton>
                        <Box display={"flex"} flexDirection={"row"} columnGap={1}>
                            <Button variant="text">
                                <LockOpenIcon />
                                Sign In
                            </Button>
                            <Button variant="text">
                                <AppRegistrationIcon />
                                Sign Up
                            </Button>
                        </Box>
                    </Box>
                </Stack>
            </Toolbar>
        </AppBar>
    </>
);

export default Header;
