'use client'
import { RHFAutocompleteField } from '@/components/Forms/FormAutocomplete'
import ApiAuth from '@/hook/ApiAuth'
import { FiscalYear } from '@/schema/Table'
import { FiscalYearSchema, FiscalYearType } from '@/schema/form/FiscalYear'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button } from '@mui/material'
import { AxiosError } from 'axios'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

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
            const res = await ApiAuth.put('/fiscal-year/change-status/' + data.fiscalYearId);
            toast.success(res.data.message);
        } catch (error) {
            if (error instanceof AxiosError) {
                const message = error.response?.data.message
                toast.error(message);
            } else {
                throw new Error("Unexpected API Error")
            }

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
