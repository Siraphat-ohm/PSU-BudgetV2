import { SignUpSchema, UpdateUserSchema } from "@/schemas/user.schema"
import { z } from "zod"

export type SignUpSchemaType = z.infer<typeof SignUpSchema>

export type UpdateUserSchemaType = z.infer<typeof UpdateUserSchema>