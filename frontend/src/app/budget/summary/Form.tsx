'use client'
import { RHFAutocompleteField } from '@/components/Forms/FormAutocomplete'
import { FormInputDate } from '@/components/Forms/FormDatePicker'
import useFetch from '@/hook/useFectch'
import { SummarySchema, SummarySchemaType } from '@/schemas/summary'
import { FacultyOption } from '@/types/options'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box } from '@mui/material'
import React from 'react'
import { useForm } from 'react-hook-form'

const STATUS_OPTIONS = [
    {
        id: "N",
        name: "N"
    },
    {
        id: "D",
        name: "D"
    },
]

const MODE_OPTIONS = [
    {
        id: "N",
        name: "รายเงินเงินประจำปี"
    },
    {
        id: "D",
        name: "รายงานเงินกัน"
    },
    {
        id: "A",
        name: "รายงานเงินภาพรวม"
    },
    {
        id: "B",
        name: "รายงานเงินเหลือจ่าย"
    },
]

const Form = () => {
    const {
        control,
        watch
    } = useForm<SummarySchemaType>({ resolver: zodResolver(SummarySchema) });
    const { data: faculties, error: facultiesError } = useFetch<FacultyOption[]>('/tables/fauclties/options');

    return (
        <Box className="mt-3">
            <Box className="flex gap-3">
                <FormInputDate name='startDate' control={control} label='Start Date' />
                <FormInputDate name='endDate' control={control} label='End  Date' />
                <RHFAutocompleteField options={  faculties ?  [ { "id": 0, name: "All" } , ...faculties ] : []} control={control} name='facultyId' placeholder='Faculty' />
                <RHFAutocompleteField options={STATUS_OPTIONS} control={control} name='status' placeholder='Status' defaultValue={"N"} />
                <RHFAutocompleteField options={MODE_OPTIONS} control={control} name='mode' placeholder='Mode' defaultValue={'N'}/>
            </Box>
        </Box>
    )
}

export default Form;