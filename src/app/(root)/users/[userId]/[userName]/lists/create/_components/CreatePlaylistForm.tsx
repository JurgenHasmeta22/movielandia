"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import { createPlaylist } from "@/actions/playlist/playlist.actions";
import { showToast } from "@/utils/helpers/toast";
import { playlistSchema, type PlaylistFormData } from "@/schemas/playlist.schema";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

interface CreatePlaylistFormProps {
    userId: number;
}

export default function CreatePlaylistForm({ userId }: CreatePlaylistFormProps) {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<PlaylistFormData>({
        resolver: zodResolver(playlistSchema),
        defaultValues: {
            name: "",
            description: "",
            isPrivate: false,
        },
    });

    const onSubmit = async (data: PlaylistFormData) => {
        try {
            await createPlaylist({
                ...data,
                userId,
            });
        } catch (error) {
            showToast("error", "Failed to create playlist. Please try again.");
            console.error("Failed to create playlist:", error);
        }
    };

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: 600,
                mx: "auto",
                bgcolor: "background.paper",
                borderRadius: 1,
                p: { xs: 2, sm: 3 },
                boxShadow: 1,
            }}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2.5,
                    }}
                >
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Playlist Name"
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                fullWidth
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
                                multiline
                                rows={3}
                                error={!!errors.description}
                                helperText={errors.description?.message}
                                fullWidth
                            />
                        )}
                    />
                    <Controller
                        name="isPrivate"
                        control={control}
                        render={({ field: { onChange, value, ...field } }) => (
                            <FormControl error={!!errors.isPrivate}>
                                <InputLabel>Privacy</InputLabel>
                                <Select
                                    {...field}
                                    value={value ? "private" : "public"}
                                    onChange={(e) => onChange(e.target.value === "private")}
                                    label="Privacy"
                                >
                                    <MenuItem value="public">Public</MenuItem>
                                    <MenuItem value="private">Private</MenuItem>
                                </Select>
                                {errors.isPrivate && <FormHelperText>{errors.isPrivate.message}</FormHelperText>}
                            </FormControl>
                        )}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        fullWidth
                        disabled={isSubmitting}
                        startIcon={<AddCircleOutlineIcon />}
                        sx={{
                            textTransform: "none",
                            transition: "all 0.2s ease-in-out",
                        }}
                    >
                        Create List
                    </Button>
                </Box>
            </form>
        </Box>
    );
}
