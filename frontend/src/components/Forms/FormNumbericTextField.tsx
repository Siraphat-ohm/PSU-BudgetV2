import * as React from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import TextField from "@mui/material/TextField";
import { Control, Controller, FieldValues, Path, PathValue } from "react-hook-form";

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

export const NumericFormatCustom = React.forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value
            }
          });
        }}
        thousandSeparator
        valueIsNumericString
        decimalScale={2}
        fixedDecimalScale
      />
    );
  }
);
interface NubmericProps  {
  onChange?: ( e:any ) => void;
  value?: string | number;
  label?: string;
}

export const NumericDisplay = ( { label = "" , value }: NubmericProps ) => {

  return (
      <TextField
        label={label}
        value={value ?? ''}
        InputProps={{
          inputComponent: NumericFormatCustom as any,
          readOnly: true
        }}
        disabled
        fullWidth
      
      />
  );
}

type FormInputProps<TFormValue extends FieldValues> = {
  name: Path<TFormValue>,
  control: Control<TFormValue>,
  label: string,
  placeholder: string,
  type?: React.HTMLInputTypeAttribute,
  defaultValue?: PathValue<TFormValue, Path<TFormValue>>
}

const FormInputNumberic = <TFormValue extends Record<string, unknown>>({ name, placeholder, control, label, type = "text", defaultValue}: FormInputProps<TFormValue>) => {
  return (
      <Controller
          name={name}
          defaultValue={defaultValue}
          control={control}
          render={({
              field: { onChange, value, ref },
              fieldState: { error },
          }) => (
              <TextField
                  helperText={error ? error.message : null}
                  InputProps={{ inputComponent: NumericFormatCustom as any, }}
                  error={!!error}
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label={label}
                  variant="outlined"
                  type={type}
                  placeholder={placeholder}
                  ref={ref}
              />
          )}
      />
  );
};

export default FormInputNumberic;