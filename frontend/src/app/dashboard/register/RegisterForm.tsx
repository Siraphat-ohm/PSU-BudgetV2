'use client';
import { FormInputText } from "@/components/Forms/FormTextField";
import ApiAuth from "@/hook/ApiAuth";
import useFetch from "@/hook/useFectch";
import { SignUpSchema } from "@/schemas/user.schema";
import { RowFacultyType } from "@/types/table-z.type";
import { SignUpSchemaType } from "@/types/user-z.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Autocomplete, Button, Chip, TextField, Typography } from "@mui/material";
import { AxiosError } from "axios";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

const RegisterForm = () => {
    const { data: faculties, error: facultiesError, isLoading: facultiesLoading } = useFetch<RowFacultyType[]>('/tables/faculties');

    const {
        handleSubmit,
        formState: { errors },
        control,
        setError,
        reset
    } = useForm<SignUpSchemaType>({ resolver: zodResolver(SignUpSchema) });

    if (facultiesLoading) {
        return <div className="loader">Loading...</div>;
    }

    const onSubmit: SubmitHandler<SignUpSchemaType> = async (data) => {
        try {
            const res = await ApiAuth.post( '/users/signUp', data );
            if ( res.status === 200 ) reset()
            toast.success( res.data.message );
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
        <form className="flex flex-col gap-6 mt-3" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex gap-2 items-center">
                <FormInputText control={control} name="username" label="Username" placeholder="Enter a username" defaultValue="" />
                <FormInputText control={control} name="password" label="Password" placeholder="Enter a password" defaultValue="" type="password" />
            </div>
            <div className="flex gap-2 items-center">
                <FormInputText control={control} name="firstName" label="Firstname" placeholder="Enter a firstname" defaultValue="" />
                <FormInputText control={control} name="lastName" label="Lastname" placeholder="Enter a lastname" defaultValue="" />
            </div>
            <div className="flex gap-2 items-center">
                <Controller
                    name="faculties"
                    control={control}
                    render={({ field }) => {
                        const { onChange, value, ref } = field;
                        return <Autocomplete
                            multiple
                            value={
                                value ? value : []
                            }
                            isOptionEqualToValue={ ( option, value ) => option.id === value.id  }
                            getOptionLabel={(option) => option.name}
                            options={faculties ?? []}
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
            <Button variant="contained" type="submit">Create a new user</Button>
        </form>
    );
}

export default RegisterForm;