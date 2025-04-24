import { z } from "zod";

export const listSchema = z.object({
	name: z.string().min(1, { message: "List name is required" }),
	description: z.string().optional(),
	isPrivate: z.boolean(),
});

export type ListFormData = z.infer<typeof listSchema>;
