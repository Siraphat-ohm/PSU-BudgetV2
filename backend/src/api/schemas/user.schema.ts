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
    firstName: z.string({
        required_error: "firstName is required."
    }),
    lastName: z.string({
        required_error: "lastName is required."
    }),
    faculties: z.string({}).array()
})

export const updateSchema = z.object( {
    username: z.string( {
        required_error: "Name is required."
    }),
    password: z.string({}),
    firstName: z.string({}),
    lastName: z.string({}),
    faculties: z.string({}).array()
})

export const IdUserSchema = z.object({ 
    id: z.string({
        required_error: "Id is required."
    })
})