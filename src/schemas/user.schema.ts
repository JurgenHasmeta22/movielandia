import { z } from "zod";

export const userSchema = z.object({
    userName: z.string().min(1, { message: "required" }),
    email: z.string().min(1, { message: "required" }),
});

export const addUserSchema = z.object({
    userName: z.string().min(1, { message: "required" }),
    email: z.string().min(1, { message: "required" }),
    password: z.string().min(1, { message: "required" }),
});
