import { z } from "zod";

export const signInSchema = z.object({
    username: z.string({
        required_error: "Username is required.",
        invalid_type_error: "Username must be a string."
    }),
    password: z.string({
        required_error: "Password is required.",
        invalid_type_error: "Password must be a string of at least 5 characters."
    }).min(5)
});

export const signUpSchema = z.object({
    username: z.string({
        required_error: "Username is required.",
        invalid_type_error: "Username must be a string."
    }),
    password: z.string({
        required_error: "Password is required.",
        invalid_type_error: "Password must be a string of at least 5 characters."
    }).min(5),
    firstName: z.string({
        required_error: "First name is required.",
        invalid_type_error: "First name must be a string."
    }),
    lastName: z.string({
        required_error: "Last name is required.",
        invalid_type_error: "Last name must be a string."
    }),
    faculties: z.string({}).array()
});

export const updateSchema = z.object({
    username: z.string({
        required_error: "Username is required.",
        invalid_type_error: "Username must be a string."
    }),
    password: z.string({ invalid_type_error: "Password must be a string." }),
    firstName: z.string({ invalid_type_error: "First name must be a string." }),
    lastName: z.string({ invalid_type_error: "Last name must be a string." }),
    faculties: z.string({}).array()
});

export const IdUserSchema = z.object({
    id: z.string({
        required_error: "ID is required.",
        invalid_type_error: "ID must be a number."
    })
});
