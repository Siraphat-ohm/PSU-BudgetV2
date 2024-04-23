'use client';
import { FormInputText } from "@/components/Forms/FormTextField";
import { User } from "@/interfaces/user";
import ApiAuth from "@/hook/ApiAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Autocomplete, Button, Chip, TextField } from "@mui/material";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { UpdateUserSchemaType, UpdateUserSchema } from "@/schema/form/User";
import { Faculty } from "@/schema/tables/faculty";

type Props = {
    user: User,
    faculties: Faculty[]
}

const EditUserForm = ( { user, faculties  }: Props ) => {

    const router = useRouter();

    const {
        handleSubmit,
        formState: { errors },
        control,
        setError,
        reset
    } = useForm<UpdateUserSchemaType>({ resolver: zodResolver(UpdateUserSchema) });

    const onSubmit: SubmitHandler<UpdateUserSchemaType> = async (data) => {
        try {
            const res = await ApiAuth.put( `/users/${user.id}`, data );
            if ( res.status !== 204 ) throw new Error( "Unexpected Api Error")
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
        <form className="flex flex-col gap-6 mt-3" onSubmit={handleSubmit(onSubmit)}>
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

export default EditUserForm;