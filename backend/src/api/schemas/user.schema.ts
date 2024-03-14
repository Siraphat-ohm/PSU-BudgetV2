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