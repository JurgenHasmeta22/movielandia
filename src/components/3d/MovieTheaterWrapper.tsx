"use client";

import MovieTheater from "./MovieTheater";
import { Box } from "@mui/material";

export default function MovieTheaterWrapper() {
    return (
        <Box sx={{ width: "100%", height: "80vh", bgcolor: "black" }}>
            <MovieTheater />
        </Box>
    );
}
