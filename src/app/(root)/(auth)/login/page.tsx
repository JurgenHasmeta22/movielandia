import { Box, Paper } from "@mui/material";
import type { Metadata } from "next";
import LoginForm from "./_components/LoginForm";
import Image from "next/image";

export const metadata: Metadata = {
    title: "Login - MovieLandia24 - Your Ultimate Destination for Movies",
    description: "Login to the page",
};

export default async function Login() {
    return (
        <Box
            sx={{
                position: "relative",
                display: "flex",
                placeContent: "center",
                placeItems: "center",
                paddingTop: 10,
                paddingBottom: 10,
            }}
            component="section"
        >
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: -1,
                }}
            >
                <Image
                    src="/images/backgrounds/netflix.png"
                    alt="Background Image"
                    fill
                    priority={true}
                    style={{
                        objectFit: "cover",
                    }}
                />
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        filter: "blur(2px)",
                    }}
                />
            </Box>
            <Paper
                sx={{
                    px: 10,
                    py: 4,
                    borderRadius: 4,
                    position: "relative",
                    zIndex: 1,
                }}
            >
                <LoginForm />
            </Paper>
        </Box>
    );
}
