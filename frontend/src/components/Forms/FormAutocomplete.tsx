import * as React from "react";
import { Controller, Control, Path, FieldValues, PathValue } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

interface option {
  id: number | string
  name: string,
  code?: string
}

interface RHFAutocompleteFieldProps<
  O extends option,
  TField extends FieldValues
> {
  control: Control<TField>;
  name: Path<TField>;
  options: O[];
  placeholder?: string;
  defaultValue?: PathValue<TField, Path<TField>> | undefined
  size?: 'small' | 'medium'
}

export const RHFAutocompleteField = <
  O extends option,
  TField extends FieldValues
>(
  props: RHFAutocompleteFieldProps<O, TField>
) => {
  const { control, options, name, defaultValue } = props;
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: "this field is requried"
      }}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => {
        const { onChange, value, ref } = field;
        return (
          <Autocomplete
            disabled={options.length === 0}
            value={
              value
                ? options.find((option) => {
                  return value === option.id;
                }) ?? null
                : null
            }
            getOptionLabel={(option) => option.name}
            onChange={(event: any, newValue) => {
              onChange(newValue ? newValue.id : null);
            }}
            options={options}
            renderInput={( params ) => {
              const { size } = props
              return (
                <TextField
                  {...params}
                  size={size}
                  label={props.placeholder}
                  inputRef={ref}
                  error={!!error}
                  helperText={error?.message}
                />)
            }
            }
            fullWidth
          />
        );
      }}
    />
  );
};
