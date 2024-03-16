'use client';

import { Button } from "@nextui-org/button";
import { Divider, Input } from "@nextui-org/react";
import * as React from "react";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema, SignInFormData } from "@/schema/user";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignIn() {
    const router = useRouter();
    const { 
        handleSubmit, 
        register,
        formState: { errors },
        setError,
    } = useForm<SignInFormData>({
        resolver: zodResolver(SignInSchema),
    });

    const onSubmit: SubmitHandler<SignInFormData> = async(data) => { 
        try {
            const { username, password } = data;
            const res = await signIn( "credentials", { data, redirect: false, username, password } );
            if ( !res?.ok )
                throw new Error( res?.error as string );
            router.replace( "/admin" );
        } catch (error: any) {
            const message = error.message
            setError( "password", { type: "custom", message } )
        }
    }

    return (
        <div 
            className="flex justify-center items-center h-screen"
        >
            <div className="w-96 p-6 shadow-lg rounded-lg bg-white">
                <Image
                    priority={true}
                    src={"/static/banner_login.jpg"} 
                    alt={""} width={150} 
                    height={100} 
                    className="mx-auto"
                />
                <Divider className="mt-1"/>
                <div>
                    <form onSubmit={ handleSubmit(onSubmit)}  className="mt-1">
                        <Input 
                            className="py-1"
                            label="username"
                            { ...register("username") } 
                        />
                        <Input 
                            type="password"
                            label="password"
                            { ...register("password") } 
                            errorMessage= { errors.password?.message }
                        />
                        <Button 
                            className="bg-primary text-white w-full mt-2"
                            type="submit"
                        > 
                            Login 
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}