// validation/loginSchema.ts
import { z } from "zod";

export const loginSchema = z.object({
    email: z.email("Email non valida"),
    password: z.string().min(6, "La password deve contenere almeno 6 caratteri"),
});
