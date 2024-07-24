"use client";

import { tokens } from "@/utils/theme/theme";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    // const router = useRouter();

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
                <Typography variant="h1" component="h1" fontSize={70} gutterBottom sx={{ color: colors.primary[100] }}>
                    Page not found.
                </Typography>
                <Typography variant="h3" component="p" sx={{ color: colors.primary[100] }}>
                    The page you are looking for might have been removed, or is temporarily unavailable.
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => {
                        // router.push("/");
                    }}
                    sx={{ mt: 4, color: colors.primary[100], backgroundColor: colors.greenAccent[600] }}
                >
                    Go to Home
                </Button>
            </Box>
        </Box>
    );
}
