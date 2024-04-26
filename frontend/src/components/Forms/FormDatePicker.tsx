import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Control, Controller, FieldValues, Path, PathValue } from "react-hook-form";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';

type FormInputProps<TFormValue extends FieldValues> = {
    name: Path<TFormValue>,
    control: Control<TFormValue>,
    label: string,
    defaultValue?: PathValue<TFormValue, Path<TFormValue>> | undefined
};

export const FormInputDate = <TFormValue extends Record<string, unknown>>({
    name,
    control,
    label,
    defaultValue
}: FormInputProps<TFormValue>) => {
    return (
        <LocalizationProvider
            dateAdapter={AdapterDateFns}
        >
            <Controller
                name={name}
                control={control}
                rules={{
                    required: "this field is requried"
                }}
                defaultValue={defaultValue}
                render={({ field: { onChange, value, ref }, fieldState: { error } }) => ( 
                        <DatePicker
                            label={label}
                            value={value || null}
                            onChange={onChange}
                            inputRef={ref}
                            className="w-[100%]"
                            
                            slotProps={{
                                field: {
                                    clearable: true
                                },
                                textField: {
                                     helperText: error ? error.message : null,
                                     error: !!error
                                }
                            }}
                        />
                )}
            />
        </LocalizationProvider>
    );
};
