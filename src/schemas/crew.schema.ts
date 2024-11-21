import { z } from "zod";

export const crewSchema = z.object({
    fullname: z.string().min(1, "Full name is required"),
    photoSrc: z.string().min(1, "Photo source is required"),
    photoSrcProd: z.string().min(1, "Production photo source is required"),
    role: z.string().min(1, "Role is required"),
    description: z.string().min(1, "Description is required"),
    debut: z.string().min(1, "Debut date is required"),
});
