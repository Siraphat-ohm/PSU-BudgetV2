'use client';

import ApiAuth from "@/_lib/hook/ApiAuth";
import useFetch from "@/_lib/hook/useFectch";
import { RegisterFormData, RegisterSchema } from "@/_schema/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { AxiosError } from "axios";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface Faculty {
    id: number | string ;
    fac: string;
  }
  
type FetchFacultyResponse = Faculty[];


export default function Register() {

    const [ selected, setSelected ] = useState( new Set( [] ) );

    const { data, error, isLoading } = useFetch<FetchFacultyResponse>( '/faculties' );
    
    const {
        handleSubmit,
        register,
        formState: { errors },
        reset
    } = useForm<RegisterFormData>({
        resolver: zodResolver(RegisterSchema),
    });

    const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
        try {
            const formData = { ...data, faculties: Array.from( selected ) }
            const res = await ApiAuth.post('/users/signUp', formData );
            toast.success( res.data.message );
            setSelected( new Set([]) );
            reset();
        } catch ( errory: any ) {
            let message;
            if ( error instanceof AxiosError ){
                message = error.response?.data.message
                toast.error( message );
            }
            
            throw new Error( "Unexpected API Error")
        }
    }

    if ( isLoading ) return <div> loading... </div>
    if ( error ) throw new Error( error )

    return (
        <div className="p-6  w-[50%]">
            <form className="grid grid-cols-1 gap-6 border rounded-md p-6 bg-white" onSubmit={handleSubmit(onSubmit)}>
                <h1 className="text-4xl font-semibold"> Add User</h1>
                <div className="flex gap-1 items-center">
                    <Input
                        label="firstname"
                        size="lg"
                        className="w-[50%]"
                        { ...register("firstname") } 
                        errorMessage= { errors.firstname?.message }                    
                        isRequired
                    />
                    <Input
                        label="lastname"
                        size="lg"
                        className="w-[50%]"
                        { ...register("lastname") } 
                        errorMessage= { errors.lastname?.message }                    
                        isRequired
                    />
                </div>
                <div className="flex gap-1 items-center">
                    <Input
                        className="py-1 w-[50%]"
                        label="username"
                        size="lg"
                        { ...register("username") } 
                        errorMessage= { errors.username?.message }                    
                        isRequired
                    />
                    <Input
                        { ...register("username") } 
                        type="password"
                        label="password"
                        size="lg"
                        className="w-[50%]"
                        { ...register("password") } 
                        errorMessage= { errors.password?.message }                    
                        isRequired                    

                    />
                </div>
               <Select
                    label="Faculties"
                    selectionMode="multiple"
                    placeholder="Select a Faculty"
                    selectedKeys={selected}
                    onSelectionChange={(e) => setSelected( e as any) }
                >
                    { data ? data.map((fac: any) => (
                        <SelectItem key={fac.id} value={fac.id}>
                            {fac.fac}
                        </SelectItem>
                    )) : []
                }
                </Select>
                <Button
                    type="submit"
                >
                    Create a new user
                </Button>
            </form>
        </div>
    )
};