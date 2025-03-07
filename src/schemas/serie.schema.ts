import { z } from "zod";

export const serieSchema = z.object({
    title: z.string().min(1, { message: "required" }),
    photoSrc: z.string().min(1, { message: "required" }),
    photoSrcProd: z.string().min(1, { message: "required" }),
    dateAired: z.coerce.date(),
    ratingImdb: z.coerce.number().min(1, { message: "required" }),
});
