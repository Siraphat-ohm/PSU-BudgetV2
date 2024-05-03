'use client'
import { RHFAutocompleteField } from '@/components/Forms/FormAutocomplete'
import ApiAuth from '@/hook/ApiAuth'
import { FiscalYear } from '@/schema/Table'
import { FiscalYearSchema, FiscalYearType } from '@/schema/form/FiscalYear'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button } from '@mui/material'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

const Form = ({ fiscalYears }: { fiscalYears: FiscalYear[] }) => {
    const {
        handleSubmit,
        formState: { errors },
        control
    } = useForm<FiscalYearType>({
        resolver: zodResolver(FiscalYearSchema)
    });

    const onSubmit: SubmitHandler<FiscalYearType> = async (data) => {
        try {
            const res =  await ApiAuth.post('/users/fiscal-year/change', data);
            console.log(res.data.message);
        } catch (e) {
            console.log(e); 
        }
    }
    return (
            <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3 mt-3">
                <RHFAutocompleteField control={control} name='fiscalYearId' options={fiscalYears} placeholder='Fiscal year' size='small' />
                <Button variant="contained" type='submit'>change</Button>
            </form>
    )
}

export default Form
