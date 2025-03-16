"use client";

import { Box, Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";

const CreateListHeader = () => {
    const router = useRouter();

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                mb: 4,
                position: "relative",
            }}
        >
            <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => {
                    router.back();
                }}
                sx={{
                    textTransform: "none",
                    minWidth: "auto",
                    position: "absolute",
                    left: 0,
                    zIndex: 1,
                }}
            >
                Back
            </Button>
            <Typography
                variant="h1"
                sx={{
                    fontSize: "1.25rem",
                    fontWeight: "500",
                    width: "100%",
                    textAlign: "center",
                }}
            >
                Create New List
            </Typography>
        </Box>
    );
};

export default CreateListHeader;
