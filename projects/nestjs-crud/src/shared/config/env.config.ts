import { z } from "zod";
const EnvSchema = z.object({
    DATABASE_URL: z.string(),
    PORT: z.coerce.number().default(3000),
})
export type Env = z.infer<typeof EnvSchema>
export function envValidate(config:Record<string, unknown>) {
    return EnvSchema.parse(config)
}
