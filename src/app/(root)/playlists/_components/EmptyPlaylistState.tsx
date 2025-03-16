import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function EmptyPlaylistState() {
    const router = useRouter();

    return (
        <Box 
            sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '400px',
                textAlign: 'center',
                p: 4
            }}
        >
            <Typography variant="h5" sx={{ mb: 2 }}>
                No Playlists Yet
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
                Create your first playlist to start organizing your favorite content
            </Typography>
            <Button 
                variant="contained" 
                color="primary"
                onClick={() => router.push("/playlists/create")}
            >
                Create Playlist
            </Button>
        </Box>
    );
}