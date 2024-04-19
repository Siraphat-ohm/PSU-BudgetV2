import { z, } from "zod";

export const SignInSchema = z.object({
    username: z.string(),
    password: z.string().min( 5 )
});

export type SignInSchemaType = z.infer<typeof SignInSchema>;

export const SignUpSchema = z.object({
    username: z.string(),
    password: z.string().min( 5 ),
    firstName: z.string(),
    lastName: z.string(),
    faculties: z.object({
        id: z.number(),
        name: z.string()
    }).array().optional()
});


export const UpdateUserSchema = z.object({
    username: z.string(),
    password: z.string().optional(),
    firstName: z.string(),
    lastName: z.string(),
    faculties: z.object({
        id: z.number(),
        name: z.string()
    }).array().optional()
})
