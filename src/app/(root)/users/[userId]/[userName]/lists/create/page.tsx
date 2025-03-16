import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import CreatePlaylistForm from "./_components/CreatePlaylistForm";
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
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                pt: { xs: 8, sm: 10 },
                px: { xs: 2, sm: 4 },
                pb: 4,
                bgcolor: 'background.default'
            }}
        >
            <Box sx={{ 
                maxWidth: 'lg',
                width: '100%',
                mx: 'auto',
                flex: 1
            }}>
                <h1 style={{ 
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    marginBottom: '1.5rem'
                }}>
                    Create New Playlist
                </h1>
                <CreatePlaylistForm userId={Number(session.user.id)} />
            </Box>
        </Box>
    );
}