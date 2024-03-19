'use client';

import ApiAuth from "@/_lib/hook/ApiAuth";
import useFetch from "@/_lib/hook/useFectch";
import { IFacResponse, IUsersResponse } from "@/_schema/response";
import { EditSchema, UpdateFormData } from "@/_schema/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
type Props = {
    params: {
        id: string
    }
}

export default function Edit( { params }: Props ) {

    const router = useRouter()

    const [ selected, setSelected ] = useState<Set<string>>( new Set( [] ) );

    const { data, error, isLoading } = useFetch<IFacResponse[]>( '/facs' );

    const { data:user, error:userError, isLoading:userLoading, mutate: userMutate } = useFetch<IUsersResponse>( `/users/${params.id}` );


    useEffect(() => {
        if (user) {
            const selectedFacIds = user.facs.map((fac) => fac.id.toString() );
            setSelected(new Set(selectedFacIds)); 
        }
    }, [user]); 

    
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<UpdateFormData>({
        resolver: zodResolver(EditSchema),
    });

    const onSubmit: SubmitHandler<UpdateFormData> = async (data) => {
        try {
            const formData = { ...data, faculties: Array.from( selected ) }
            const res = await ApiAuth.put( `/users/${params.id}`, formData );
            if ( res.status === 200 ) {
                userMutate()
                router.replace( '/admin/users' )
            }
        } catch ( errory: any ) {
            let message;
            if ( error instanceof AxiosError ){
                message = error.response?.data.message
                toast.error( message );
            }
            
            throw new Error( "Unexpected API Error")
        }
    }
    const handleSelectChange = useCallback((e: any) => {
        setSelected(e as any);
      }, [setSelected]);

    if ( isLoading || userLoading ) return <div> loading... </div>
    if ( error || userError ) throw new Error( error )

    return (
        <div className="p-6  w-[50%]">
            <form className="grid grid-cols-1 gap-6 border rounded-md p-6 bg-white" onSubmit={handleSubmit(onSubmit)}>
                <h1 className="text-4xl font-semibold">Edit User</h1>
                <div className="flex gap-1 items-center">
                    <Input
                        label="firstname"
                        size="lg"
                        className="w-[50%]"
                        { ...register("firstname") } 
                        errorMessage= { errors.firstname?.message }                    
                        defaultValue={ user.firstname }
                        isRequired
                    />
                    <Input
                        label="lastname"
                        size="lg"
                        className="w-[50%]"
                        { ...register("lastname") } 
                        errorMessage= { errors.lastname?.message }                    
                        defaultValue={ user.lastname }
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
                        defaultValue= { user.username }
                        isRequired
                    />
                    <Input
                        { ...register("username") } 
                        type="password"
                        label="new password"
                        size="lg"
                        className="w-[50%]"
                        { ...register("password") } 
                        errorMessage= { errors.password?.message }                    

                    />
                </div>
               <Select
                    label="Faculties"
                    selectionMode="multiple"
                    placeholder="Select a Faculty"
                    selectedKeys={selected}
                    isRequired
                    onSelectionChange={handleSelectChange}
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
                    Edit user
                </Button>
            </form>
        </div>
    )
};
