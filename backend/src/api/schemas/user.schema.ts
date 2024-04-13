import { string, z } from "zod";

export const signInSchema = z.object({
    body: z.object({
        username: z.string({
            required_error: "Username is required.",
            invalid_type_error: "Username must be a string."
        }),
        password: z.string({
            required_error: "Password is required.",
            invalid_type_error: "Password must be a string of at least 5 characters."
        }).min(5)
    })
});

export const signUpSchema = z.object({
    body: z.object({
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
        faculties: z.object({
            name: z.string(),
            id: z.number()
        }).array().optional()
    })
});

export const removeUserSchema = z.object({
    params: z.object({
        id: z.string({
            required_error: "Id is required.",
            invalid_type_error: "Id must be string."
        })
    })
});

export const fetchUserByIdSchema = z.object({
    params: z.object({
        id: z.string({
            required_error: "Id is required.",
            invalid_type_error: "Id must be string."
        })
    })
});

export const updateUserSchema = z.object({
    body: z.object({
        username: z.string({
            required_error: "Username is required.",
            invalid_type_error: "Username must be a string."
        }),
        password: z.string({ invalid_type_error: "Password must be a string." }).optional(),
        firstName: z.string({ invalid_type_error: "First name must be a string." }),
        lastName: z.string({ invalid_type_error: "Last name must be a string." }),
        faculties: z.object({
            name: z.string(),
            id: z.number()
        }).array().optional()
    }),
    params: z.object({
        id: z.string({
            required_error: "Id is required.",
            invalid_type_error: "Id must be string."
        })
    })
});
