'use client';
import { RHFAutocompleteField } from '@/components/Forms/FormAutocomplete';
import { FormInputDate } from '@/components/Forms/FormDatePicker';
import FormInputNumberic, { NumericDisplay } from '@/components/Forms/FormNumbericTextField';
import { FormInputText } from '@/components/Forms/FormTextField';
import ApiAuth from '@/lib/hook/ApiAuth';
import useFetch from '@/lib/hook/useFectch';
import { DisbursedSchema, DisbursedSchemaType } from '@/schemas/budget';
import { FacultyOption, ItemcodeOption } from '@/types/options';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@mui/material';
import { AxiosError } from 'axios';
import React from 'react'
import { SubmitHandler, useForm  } from 'react-hook-form';
import toast from 'react-hot-toast';

const DisburementForm = () => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
    reset
  } = useForm<DisbursedSchemaType>({ resolver: zodResolver(DisbursedSchema) });


  const { data: faculties, error: facultiesError } = useFetch<FacultyOption[]>('/tables/fauclties/options');
  const facultyId = watch("facultyId");
  const { data: codes, error: codesError } = useFetch<ItemcodeOption[]>(facultyId ? `/tables/codes/${facultyId}/options` : "")

  const onSubmit: SubmitHandler<DisbursedSchemaType> = async (data) => {
    try {
      const res = await ApiAuth.post("/budgets/disbursed", data);
      toast.success( res.data.message );
      reset() 
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data.message
        toast.error(message);
      } else {
        throw new Error("Unexpected API Error")
      }
    }
  }

  if ( facultiesError ) throw new facultiesError;
  if ( codesError ) throw new codesError

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)} >
      <div className="flex gap-2 items-center">
        <RHFAutocompleteField name='facultyId' control={control} options={faculties ?? []} placeholder='Faculties' />
        <RHFAutocompleteField name='codeId' control={control} options={codes ?? []} placeholder='Codes' />
      </div>
      <div className="flex gap-2 items-center">
        <FormInputNumberic name='amount' control={control} placeholder='Enter amount' label='Amount' defaultValue={''}/>
        <NumericDisplay value={codes ? codes.find(code => code.id === watch("codeId"))?.balance : '-'} label="Balance" />
      </div>
      <div className="flex gap-2 items-center">
        <FormInputText name="psuCode" control={control} label='PSU-code' placeholder='Enter a psucode' defaultValue='' />
        <FormInputDate name='date' control={control} label='Date' />
      </div>
      <div className="flex gap-2 items-center">
        <FormInputText name="note" control={control} label='Note' placeholder='Enter a note' multiline defaultValue=''/>
      </div>
      <Button variant="contained" type="submit">Disburse</Button>
    </form>
  )
}

export default DisburementForm;