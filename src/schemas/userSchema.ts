import { z } from 'zod'
export const userSchema = z.object({
    id: z.string().min(1, "Id is required"),
    name: z.string().min(1, "Name is required"),
    role: z.enum(['user', 'admin']),
});