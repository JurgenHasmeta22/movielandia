import { z } from "zod";

export const serieSchema = z.object({
    title: z.string().min(1, { message: "required" }),
    photoSrc: z.string().min(1, { message: "required" }),
    photoSrcProd: z.string().min(1, { message: "required" }),
    ratingImdb: z.coerce.number().min(1, { message: "required" }),
    dateAired: z.string().min(1, { message: "required" }),
});