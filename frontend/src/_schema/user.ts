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
| "firstName"
| "lastName"
| "faculties"

export type RegisterFormData = {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
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
        firstName: z.string(),
        lastName: z.string(),
        username: z.string(),
        password: z.string().min( 5, { message: "Password is too short."}),
    })

export interface User {
    id : string;
    firstName: string;
    lastName: string;
    name: string;
    role: string;
    accessToken: string;
}

export type UpdateFormData = {
    username: string;
    password?: string;
    firstName: string;
    lastName: string;
}

export type UpdateFormFieldProps = {
    type: string;
    placeholder: string;
    name: RegisterValidFieldNames;
    register: UseFormRegister<RegisterFormData>;
    error: FieldError | undefined;
    valueAsNumber?: boolean;
};

export const EditSchema: ZodType<RegisterFormData> = z
    .object({
        firstName: z.string(),
        lastName: z.string(),
        username: z.string(),
        password: z.string()
    })

