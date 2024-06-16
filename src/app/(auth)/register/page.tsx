import RegisterForm from "@/components/registerForm/RegisterForm";
import { Box, Paper } from "@mui/material";
import type { Metadata } from "next";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Register - MovieLandi24 - Your Ultimate Destination for Movies",
    description: "Register to the page",
};

export default async function Register() {
    const session = await getServerSession(authOptions);

    if (session?.user?.email) {
        redirect("/");
    }

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
            component={"section"}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: "url('/assets/images/netflix.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "blur(2px) opacity(0.7)",
                    zIndex: -1,
                }}
            />
            <Paper
                sx={{
                    px: 8,
                    py: 6,
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
