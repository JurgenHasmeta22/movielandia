import { z } from "zod";

export const crewSchema = z.object({
    photoSrc: z.string().min(1, { message: "required" }),
    photoSrcProd: z.string().min(1, { message: "required" }),
    role: z.coerce.number().min(1, { message: "required" }),
    description: z.string().min(1, { message: "required" }),
    debut: z.coerce.number().min(1, { message: "required" }),
    fullname: z.string().min(1, { message: "required" }),
});
