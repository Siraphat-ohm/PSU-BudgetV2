import { FieldError, UseFormRegister } from "react-hook-form";
import { z, ZodType } from "zod";

export type FormData = {
    username: string;
    password: string;
}

export type FormFieldProps = {
    type: string;
    placeholder: string;
    name: ValidFieldNames;
    register: UseFormRegister<FormData>;
    error: FieldError | undefined;
    valueAsNumber?: boolean;
};

export type ValidFieldNames =
| "username"
| "password"

export const UserSchema: ZodType<FormData> = z
    .object({
        username: z.string()        ,
        password: z.string().min( 8, { message: "Password is too short."})
    })
