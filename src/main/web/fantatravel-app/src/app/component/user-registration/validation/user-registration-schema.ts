import { z } from 'zod';

export const userRegistrationSchema = z
    .object({
        firstName: z.string().nonempty({ message: "First name is required" }),
        lastName: z.string().nonempty({ message: "Last name is required" }),
        email: z.string().email({ message: "Invalid email format" }),
        password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
        passwordRepeat: z.string().min(6, { message: "Password must be at least 6 characters long" }),
    })
    .refine((data) => data.password === data.passwordRepeat, {
        message: "Passwords do not match",
        path: ["passwordRepeat"], // la proprietà dove va mostrato l'errore
    });
