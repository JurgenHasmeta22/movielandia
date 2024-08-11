import { Box, Paper } from "@mui/material";
import type { Metadata } from "next";
import RegisterForm from "./_components/RegisterForm";
import Image from "next/image";

export const metadata: Metadata = {
    title: "Register - MovieLandia24 - Your Ultimate Destination for Movies",
    description: "Register to the page",
};

export default async function Register() {
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
                    priority
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
                    px: 8,
                    py: 4,
                    borderRadius: 4,
                    position: "relative",
                    zIndex: 1,
                }}
            >
                <RegisterForm />
            </Paper>
        </Box>
    );
}
