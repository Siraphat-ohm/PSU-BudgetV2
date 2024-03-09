import { z } from "zod";

export const UserSchema = z.object({
    username: z.string( {
        required_error: "Name is required."
    }),
    password: z.string().min( 8 )
})