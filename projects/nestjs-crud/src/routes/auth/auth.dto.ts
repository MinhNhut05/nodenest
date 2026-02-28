import { z } from "zod";
import { createZodDto } from "nestjs-zod";

const RegisterSchema = z.object({
    email: z.string().email(),
    name: z.string().min(1),
    password: z.string().min(6, "Password must be at least 6 characters long").max(12, "Password must be at most 12 characters long")
})
const UserSchema = z.object({
    id: z.number(),
    email: z.string(),
    name: z.string(),
    password: z.string(),
    createdAt: z.date(),
    updatedAt: z.date()
})
export const RegisterResponseSchema = UserSchema.omit({password: true})
export class RegisterDto extends createZodDto(RegisterSchema) {}
export class RegisterResponseDto extends createZodDto(RegisterResponseSchema) {}