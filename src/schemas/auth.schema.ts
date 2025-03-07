import { z } from "zod";

export const loginSchema = z.object({
    emailOrUsername: z.string().min(1, "Email or username is required"),
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
            .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
        email: z.string().email("Invalid email format"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
            ),
        confirmPassword: z.string(),
        birthday: z
            .string()
            .nullable()
            .refine((date) => {
                if (!date) return false;
                const birthDate = new Date(date);
                const today = new Date();
                const minDate = new Date(1900, 0, 1);
                return birthDate >= minDate && birthDate <= today;
            }, "Please enter a valid date between 1900 and today"),
        gender: z.enum(["Male", "Female"]).nullable(),
        phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
        countryFrom: z.string().min(1, "Please select a country"),
        acceptTerms: z.boolean().refine((val) => val === true, "You must accept the terms and conditions"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
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
