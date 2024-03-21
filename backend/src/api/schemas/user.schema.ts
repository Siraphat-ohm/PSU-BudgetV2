import { z } from "zod";

export const signInSchema = z.object({
    username: z.string( {
        required_error: "Name is required."
    }),
    password: z.string({ 
        required_error: "Password is required."
    }).min( 5 )
})

export const signUpSchema = z.object( {
    username: z.string( {
        required_error: "Name is required."
    }),
    password: z.string({ 
        required_error: "Password is required."
    }).min( 5 ),
    firstname: z.string({
        required_error: "Firstname is required."
    }),
    lastname: z.string({
        required_error: "Lastname is required."
    }),
    faculties: z.string({
        required_error: "Faculties is required."
    }).array()
})

export const updateSchema = z.object( {
    username: z.string( {
        required_error: "Name is required."
    }),
    password: z.string({}),
    firstname: z.string({}),
    lastname: z.string({}),
    faculties: z.string({}).array()
})

export const IdUserSchema = z.object({ 
    id: z.string({
        required_error: "Id is required."
    })
})