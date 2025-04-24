import { z } from "zod";

export const userSchema = z.object({
	userName: z.string().min(1, { message: "required" }),
	email: z.string().min(1, { message: "required" }),
	age: z
		.number()
		.min(13, { message: "Must be at least 13 years old" })
		.max(120, { message: "Invalid age" })
		.optional(),
	gender: z.enum(["Male", "Female"]).default("Male"),
	phone: z
		.string()
		.regex(/^\+?[1-9]\d{1,14}$/, {
			message: "Invalid phone number format",
		}),
	countryFrom: z
		.string()
		.min(2, { message: "Country name must be at least 2 characters" }),
});

export const addUserSchema = z.object({
	userName: z.string().min(1, { message: "required" }),
	email: z.string().min(1, { message: "required" }),
	password: z.string().min(1, { message: "required" }),
	age: z
		.number()
		.min(13, { message: "Must be at least 13 years old" })
		.max(120, { message: "Invalid age" })
		.optional(),
	gender: z.enum(["Male", "Female"]).default("Male"),
	phone: z
		.string()
		.regex(/^\+?[1-9]\d{1,14}$/, {
			message: "Invalid phone number format",
		}),
	countryFrom: z
		.string()
		.min(2, { message: "Country name must be at least 2 characters" }),
});
