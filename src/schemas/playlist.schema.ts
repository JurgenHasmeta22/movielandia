import { z } from "zod";

export const playlistSchema = z.object({
    name: z.string().min(1, { message: "Playlist name is required" }),
    description: z.string().optional(),
    isPrivate: z.boolean()
});

export type PlaylistFormData = z.infer<typeof playlistSchema>;