'use client'
import { Autocomplete, TextField } from '@mui/material';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import React from 'react'

interface option {
    id: number | string
    name: string,
    code?: string
}

type Props = {
    options: option[];
    placeholder?: string;
    field: string;
    defaultValue?: option;
    disabled?: boolean;
    label?: string;
}

const SearchAutocomplete = ({ options, placeholder = "", field, defaultValue, disabled=false, label }: Props) => {
    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const pathname = usePathname();

    return (
        <Autocomplete
            options={options}
            disabled={disabled}
            getOptionLabel={(option) => option.name}
            defaultValue={defaultValue ? defaultValue : options.find(option => option.id == searchParams.get(field))}
            value={options.find(option => option.id == searchParams.get(field)) ?? null}
            onChange={( _, newValue: any) => {
                const params = new URLSearchParams(searchParams);
                if (newValue) {
                    params.set(field, newValue.id);
                } else {
                    params.delete(field);
                }
                replace(`${pathname}?${params}`);
            }}
            renderInput={( { size, ...rest}) => <TextField 
                {...rest}
                label={label}
                size='small'
                    placeholder={placeholder} 
                />
            }
            fullWidth
        />
    )
}

export default SearchAutocomplete
