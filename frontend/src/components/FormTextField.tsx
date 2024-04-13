import { Control, Controller, FieldValues, Path, PathValue } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { HTMLInputTypeAttribute } from "react";

type FormInputProps<TFormValue extends FieldValues> = {
    name: Path<TFormValue>,
    control: Control<TFormValue>,
    label: string,
    placeholder: string,
    type?: HTMLInputTypeAttribute,
    defaultValue?: PathValue<TFormValue, Path<TFormValue>>
}

export const FormInputText = <TFormValue extends Record<string, unknown>>({ name, placeholder, control, label, type = "text", defaultValue }: FormInputProps<TFormValue>) => {
    return (
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            render={({
                field: { onChange, value },
                fieldState: { error },
            }) => (
                <TextField
                    helperText={error ? error.message : null}
                    error={!!error}
                    onChange={onChange}
                    value={value}
                    fullWidth
                    label={label}
                    variant="outlined"
                    type={type}
                    placeholder={placeholder}
                />
            )}
        />
    );
};
