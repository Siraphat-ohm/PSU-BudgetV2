'use client';
import * as React from "react";
import Image from "next/image";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Box, Button, TextField } from "@mui/material";
import { SignInSchema, SignInSchemaType } from "@/schema/form/User";
import { FormInputText } from "@/components/Forms/FormTextField";

const SignIn = () => {
    const router = useRouter();

    const { data: session, status } = useSession();

    const {
        handleSubmit,
        formState: { errors },
        control,
        setError
    } = useForm<SignInSchemaType>({ resolver: zodResolver(SignInSchema) });

    React.useEffect(() => {
        if (status === "authenticated") {
            if (session.user.role === "USER") return router.replace("/budget");
            else if (session.user.role === "ADMIN") return router.replace("/dashboard");
        }
    }, [status])

    const onSubmit: SubmitHandler<SignInSchemaType> = async (data) => {
        try {
            const { username, password } = data;
            const res = await signIn( "credentials", { redirect: false, username, password } );
            if  ( !res?.ok ) throw new Error( res?.error as string );
        } catch (error: any) {
            setError( "username", { message: error.message } )
            setError( "password", { message: error.message } )
        }
    }

    return (
        <Box className="flex justify-center items-center h-screen">
            <div className="p-6 shadow-lg rounded-lg bg-neutral-900">
                <Image
                    priority={true}
                    src={"/static/banner_login.png"}
                    alt={""} width={700}
                    height={300}
                    className="mx-auto"
                />
                <div>
                    <form onSubmit={handleSubmit(onSubmit)} className="mt-1 flex flex-col gap-3">
                        <FormInputText name="username" control={control} label="Username" placeholder="Enter your username" defaultValue=""/>
                        <FormInputText name="password" control={control} label="Password" placeholder="Enter your password" defaultValue="" type="password"/>
                        <Button type="submit" variant="contained" > Login </Button>
                    </form>
                </div>
            </div>
        </Box>
    )
}

export default SignIn;