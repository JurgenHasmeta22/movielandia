import { z } from "zod";

export const listSchema = z.object({
    name: z.string().min(1, { message: "Playlist name is required" }),
    description: z.string().optional(),
    isPrivate: z.boolean(),
});

export type PlaylistFormData = z.infer<typeof listSchema>;
