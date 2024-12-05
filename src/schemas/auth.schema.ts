import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Invalid email format").min(1, "Email is a required field"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Password must be at least 8 characters, contain at least one uppercase letter, one lowercase, one number, and one special character",
        )
        .min(1, "Password is a required field"),
});

export const registerSchema = z
    .object({
        userName: z
            .string()
            .min(3, "Username must be at least 3 characters")
            .max(20, "Username can't be longer than 20 characters")
            .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
            .min(1, "Username is a required field"),
        email: z.string().email("Invalid email format").min(1, "Email is a required field"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                "Password must be at least 8 characters, contain at least one uppercase letter, one lowercase, one number, and one special character",
            )
            .min(1, "Password is a required field"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
        acceptTerms: z.boolean().refine((val) => val === true, {
            message: "You must accept the Terms of Service and Privacy Policy",
        }),
    })
    .superRefine((data, ctx) => {
        if (data.password !== data.confirmPassword) {
            ctx.addIssue({
                code: "custom",
                path: ["confirmPassword"],
                message: "Passwords must match",
            });
        }
    });

export const contactSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format").min(1, "Email is required"),
    subject: z.string().min(1, "Subject is required"),
    message: z.string().min(10, "Message must be at least 10 characters long"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const resetPasswordSchema = z.object({
    email: z.string().email({ message: "Invalid email format" }).min(1, { message: "Email is a required field" }),
});
