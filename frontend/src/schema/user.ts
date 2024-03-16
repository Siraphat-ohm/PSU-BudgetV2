import { FieldError, UseFormRegister } from "react-hook-form";
import { z, ZodType } from "zod";

export type SignInFormData = {
    username: string;
    password: string;
}

export type SignInValidFieldNames =
| "username"
| "password"

export type SignInFormFieldProps = {
    type: string;
    placeholder: string;
    name: SignInValidFieldNames;
    register: UseFormRegister<SignInFormData>;
    error: FieldError | undefined;
    valueAsNumber?: boolean;
};

export const SignInSchema: ZodType<SignInFormData> = z
    .object({
        username: z.string()        ,
        password: z.string().min( 5, { message: "Password is too short."})
});

export type RegisterValidFieldNames =
| "username"
| "password"
| "firstname"
| "lastname"
| "faculties"

export type RegisterFormData = {
    username: string;
    password: string;
    firstname: string;
    lastname: string;
}

export type ResgisterFormFieldProps = {
    type: string;
    placeholder: string;
    name: RegisterValidFieldNames;
    register: UseFormRegister<RegisterFormData>;
    error: FieldError | undefined;
    valueAsNumber?: boolean;
};

export const RegisterSchema: ZodType<RegisterFormData> = z
    .object({
        firstname: z.string(),
        lastname: z.string(),
        username: z.string(),
        password: z.string().min( 5, { message: "Password is too short."}),
    })

export interface User {
    id : number;
    firstname: string;
    lastname: string;
    name: string;
    role: string;
    accessToken: string;
}