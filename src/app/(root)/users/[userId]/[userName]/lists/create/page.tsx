import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import CreatePlaylistForm from "./_components/CreatePlaylistForm";
import CreatePlaylistHeader from "./_components/CreatePlaylistHeader";
import { Box } from "@mui/material";

export const metadata: Metadata = {
    title: "Create Playlist | MovieLandia24",
    description: "Create a new playlist for your favorite content",
};

export default async function CreatePlaylistPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/auth/signin");
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                pt: { xs: 8, sm: 10 },
                px: { xs: 2, sm: 4 },
                pb: 4,
                bgcolor: "background.default",
            }}
        >
            <Box
                sx={{
                    maxWidth: "lg",
                    width: "100%",
                    mx: "auto",
                    flex: 1,
                }}
            >
                <CreatePlaylistHeader />
                <CreatePlaylistForm userId={Number(session.user.id)} />
            </Box>
        </Box>
    );
}
