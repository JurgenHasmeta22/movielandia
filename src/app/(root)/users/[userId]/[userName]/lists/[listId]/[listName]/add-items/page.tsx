import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Box } from "@mui/material";
import { notFound } from "next/navigation";
import AddItemsForm from "./_components/AddItemsForm";
import { getPlaylistForAddItems } from "@/actions/playlist/playlist.actions";

export const metadata: Metadata = {
    title: "Add Items to Playlist | MovieLandia24",
    description: "Add items to your playlist",
};

export default async function AddPlaylistItemsPage({
    params,
}: {
    params: { playlistId: string; userId: string };
}) {
    const session = await getServerSession(authOptions);
    const result = await getPlaylistForAddItems(parseInt(params.playlistId));
    
    if (!result) {
        notFound();
    }

    const { playlist, existingType } = result;

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
            <AddItemsForm 
                playlistId={parseInt(params.playlistId)} 
                userId={parseInt(params.userId)}
                existingType={existingType}
            />
        </Box>
    );
}