"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
    Box, 
    Button, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem, 
    TextField,
    FormHelperText
} from "@mui/material";
import { createPlaylist } from "@/actions/playlist/playlist.actions";
import ContentSelector from "./ContentSelector";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { showToast } from "@/utils/helpers/toast";

const playlistSchema = z.object({
    name: z.string()
        .min(1, "Playlist name is required")
        .max(50, "Playlist name cannot exceed 50 characters"),
    description: z.string()
        .max(500, "Description cannot exceed 500 characters")
        .optional(),
    type: z.enum(["Custom", "Watchlist", "Favorites", "Watched"] as const),
    isPrivate: z.boolean()
});

type PlaylistFormData = z.infer<typeof playlistSchema>;

interface CreatePlaylistFormProps {
    userId: number;
}

export default function CreatePlaylistForm({ userId }: CreatePlaylistFormProps) {
    const router = useRouter();

    const [showContentSelector, setShowContentSelector] = useState(false);
    const [playlistId, setPlaylistId] = useState<number | null>(null);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<PlaylistFormData>({
        resolver: zodResolver(playlistSchema),
        defaultValues: {
            name: "",
            description: "",
            type: "Custom",
            isPrivate: false
        }
    });

    const onSubmit = async (data: PlaylistFormData) => {
        try {
            const playlist = await createPlaylist({
                ...data,
                userId
            });
            
            if (data.type === "Custom") {
                setPlaylistId(playlist.id);
                setShowContentSelector(true);
            } else {
                showToast("success", "Playlist created successfully!");
                router.push(`/playlists/${playlist.id}`);
            }
        } catch (error) {
            showToast("error", "Failed to create playlist. Please try again.");
            console.error("Failed to create playlist:", error);
        }
    };

    return (
        <Box sx={{ width: "100%", maxWidth: 600, margin: "0 auto", px: 2 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, my: 2 }}>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Playlist Name"
                                fullWidth
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        )}
                    />

                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Description"
                                fullWidth
                                multiline
                                rows={3}
                                error={!!errors.description}
                                helperText={errors.description?.message}
                            />
                        )}
                    />

                    <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                            <FormControl error={!!errors.type}>
                                <InputLabel>Playlist Type</InputLabel>
                                <Select {...field} label="Playlist Type">
                                    <MenuItem value="Custom">Custom</MenuItem>
                                    <MenuItem value="Watchlist">Watchlist</MenuItem>
                                    <MenuItem value="Favorites">Favorites</MenuItem>
                                    <MenuItem value="Watched">Watched</MenuItem>
                                </Select>
                                {errors.type && (
                                    <FormHelperText>{errors.type.message}</FormHelperText>
                                )}
                            </FormControl>
                        )}
                    />

                    <Controller
                        name="isPrivate"
                        control={control}
                        render={({ field }) => (
                            <FormControl error={!!errors.isPrivate}>
                                <InputLabel>Privacy</InputLabel>
                                <Select
                                    {...field}
                                    label="Privacy"
                                >
                                    <MenuItem value={"false"}>Public</MenuItem>
                                    <MenuItem value={"true"}>Private</MenuItem>
                                </Select>
                                {errors.isPrivate && (
                                    <FormHelperText>{errors.isPrivate.message}</FormHelperText>
                                )}
                            </FormControl>
                        )}
                    />

                    <Button 
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={isSubmitting}
                    >
                        Create Playlist
                    </Button>
                </Box>
            </form>

            {showContentSelector && playlistId && (
                <ContentSelector 
                    playlistId={playlistId}
                    userId={userId}
                    onComplete={() => router.push(`/playlists/${playlistId}`)}
                />
            )}
        </Box>
    );
}