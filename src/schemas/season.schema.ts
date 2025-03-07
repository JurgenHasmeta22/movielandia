import { z } from "zod";

export const seasonSchema = z.object({
    title: z.string().min(1, { message: "required" }),
    photoSrc: z.string().min(1, { message: "required" }),
    photoSrcProd: z.string().min(1, { message: "required" }),
    trailerSrc: z.string().min(1, { message: "required" }),
    description: z.string().min(1, { message: "required" }),
    dateAired: z.coerce.date(),
    ratingImdb: z.coerce.number().min(0).max(10),
    serieId: z.coerce.number().min(1, { message: "required" }),
});
