import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Control, Controller, FieldValues, Path, PathValue } from "react-hook-form";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { th } from 'date-fns/locale/th';
import dayjs from "dayjs";

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
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={th}>
            <Controller
                name={name}
                control={control}
                rules={{
                    required: "this field is requried"
                }}
                defaultValue={defaultValue}
                render={({ field: { onChange, value, ref }, fieldState: { error } }) => ( // Access error
                    <>
                        <DatePicker
                            label={label}
                            value={value || null} // Handle potential null value
                            onChange={onChange}
                            inputRef={ref} // Pass inputRef for potential focus management
                        />
                        {error ? (
                            <span style={{ color: "red" }}>{error.message}</span>
                        ) : null}
                    </>
                )}
            />
        </LocalizationProvider>
    );
};
