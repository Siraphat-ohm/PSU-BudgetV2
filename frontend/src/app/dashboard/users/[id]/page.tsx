'use client';
import { FormInputText } from "@/components/FormTextField";
import { RowFacultyType, RowUser } from "@/interfaces/table.inteface";
import ApiAuth from "@/lib/hook/ApiAuth";
import useFetch from "@/lib/hook/useFectch";
import { UpdateUserSchema, UpdateUserSchemaType } from "@/schemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Autocomplete, Button, Chip, TextField, Typography, Alert } from "@mui/material";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

type Props = {
    params: {
        id: string
    }
}

const Page = ( { params }: Props ) => {
    const { data: faculties, error: facultiesError, isLoading: facultiesLoading } = useFetch<RowFacultyType[]>('/tables/faculties');
    const { data:user, error:userError, isLoading:userLoading, mutate: userMutate } = useFetch<RowUser>( `/users/${params.id}` );

    const router = useRouter();

    const {
        handleSubmit,
        formState: { errors },
        control,
        setError,
        reset
    } = useForm<UpdateUserSchemaType>({ resolver: zodResolver(UpdateUserSchema) });

    if (facultiesLoading || userLoading ) {
        return <div className="loader">Loading...</div>;
    }

    const onSubmit: SubmitHandler<UpdateUserSchemaType> = async (data) => {
        try {
            const res = await ApiAuth.put( `/users/${params.id}`, data );
            if ( res.status !== 204 ) throw new Error( "Unexpected Api Error")
            userMutate();
            router.push( "/dashboard/users")
        } catch (error: any) {
            let message;
            if ( error instanceof AxiosError ){
                message = error.response?.data.message
                toast.error( message );
            } else {
                throw new Error( "Unexpected API Error")
            }
        }
    }

    return (
        <form className="grid grid-cols-1 gap-6 border-solid border-2 border-[#333] rounded-md p-6 w-[50%]" onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h2">Edit the user</Typography>
            <div className="flex gap-2 items-center">
                <FormInputText control={control} name="username" label="Username" placeholder="Enter a username" defaultValue={user.username} />
                <FormInputText control={control} name="password" label="New password" placeholder="Enter a new password" type="password" />
            </div>
            <div className="flex gap-2 items-center">
                <FormInputText control={control} name="firstName" label="Firstname" placeholder="Enter a firstname" defaultValue={user.firstName} />
                <FormInputText control={control} name="lastName" label="Lastname" placeholder="Enter a lastname" defaultValue={user.lastName} />
            </div>
            <div className="flex gap-2 items-center">
                <Controller
                    name="faculties"
                    control={control}
                    defaultValue={user.faculties}
                    render={({ field }) => {
                        const { onChange, value, ref } = field;
                        return <Autocomplete
                            multiple
                            value={
                                value ? value : []
                            }
                            isOptionEqualToValue={ ( option, value ) => option.id === value.id  }
                            getOptionLabel={(option) => option.name}
                            options={faculties}
                            onChange={(event: any, newValue) => {
                                onChange(newValue ? newValue : []);
                              }}
                            renderInput={(params) => <TextField {...params} label="Facutlies" inputRef={ref} />}
                            renderOption={(props, option) => {
                                return (
                                    <li {...props} key={option.id}>
                                        {option.name}
                                    </li>
                                );
                            }}
                            renderTags={(tagValue, getTagProps) => {
                                return tagValue.map((option, index) => (
                                    <Chip {...getTagProps({ index })} key={option.id} label={option.name} />
                                ))
                            }}
                            fullWidth
                        />
                    }}
                />
            </div>
            <Button variant="contained" type="submit">Edit the user</Button>
        </form>
    );
}

export default Page;