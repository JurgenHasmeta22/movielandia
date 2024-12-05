import { z } from "zod";

export const actorSchema = z.object({
    fullname: z.string().min(1, { message: "required" }),
    photoSrc: z.string().min(1, { message: "required" }),
    photoSrcProd: z.string().min(1, { message: "required" }),
    description: z.string().min(1, { message: "required" }),
    debut: z.string().min(1, { message: "required" }),
});
