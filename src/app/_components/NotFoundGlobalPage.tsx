"use client";

import { tokens } from "@/utils/theme/theme";
import { Box, colors, Link, Typography, useTheme } from "@mui/material";

export default function NotFoundGlobalPage() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                py: 4,
            }}
        >
            <Box>
                <Typography variant="h1" component="h1" gutterBottom sx={{ color: colors.primary[100] }}>
                    404
                </Typography>
                <Typography variant="h2" component="h2" gutterBottom sx={{ color: colors.primary[100] }}>
                    Ooops, page not found.
                </Typography>
                <Typography variant="h4" component="p" sx={{ color: colors.primary[100] }}>
                    The page you are looking for might have been removed, or is temporarily unavailable.
                </Typography>
                {/* <Box marginTop={8}> */}
                <Link href={"/"} style={{ textDecoration: "none", color: colors.primary[100] }}>
                    Go back home
                </Link>
                {/* </Box> */}
            </Box>
        </Box>
    );
}
