'use client';
import { RHFAutocompleteField } from '@/components/Forms/FormAutocomplete';
import { FormInputDate } from '@/components/Forms/FormDatePicker';
import FormInputNumberic, { NumericDisplay } from '@/components/Forms/FormNumbericTextField';
import { FormInputText } from '@/components/Forms/FormTextField';
import ApiAuth from '@/lib/hook/ApiAuth';
import useFetch from '@/lib/hook/useFectch';
import { DisbursedSchema, DisbursedSchemaType } from '@/schemas/budget';
import { EditHitoryDisbursement,  } from '@/types/options';
import { RowDisItemType, RowFacultyType, RowItemType } from '@/types/table-z.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { Typography, Autocomplete, TextField, Chip, Button } from '@mui/material';
import { AxiosError } from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react'
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';


type Props = {
  history: EditHitoryDisbursement
}
const FormHistory = (  { history } : Props ) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<DisbursedSchemaType>();

  const router = useRouter();
  const pathname = usePathname();

  const { data: faculties, isLoading: facultiesLoading, error: facultiesError } = useFetch<RowFacultyType[]>('/tables/fauclties/options');

  const onSubmit: SubmitHandler<DisbursedSchemaType> = async (data) => {
    try {
      const { codeId } = history;
      const res = await ApiAuth.put( `/budgets/histories/${history.id}`, { ...data, codeId });
      toast.success( res.data.message );
      
      router.replace( '/budget/histories');
    } catch (error) {
      let message;
      if (error instanceof AxiosError) {
        message = error.response?.data.message
        toast.error(message);
      } else {
        throw new Error("Unexpected API Error")
      }
    }
  }

  if ( facultiesLoading ) return <p>loading...</p>

  return (
    <form className='flex flex-col gap-6' onSubmit={handleSubmit(onSubmit)} >
      <div className="flex gap-2 items-center">
        <RHFAutocompleteField name='facultyId' control={control} options={faculties ?? []} placeholder='Faculties' defaultValue={history.facultyId}/>
        <TextField value={history.code}/>
      </div>
      <div className="flex gap-2 items-center">
        <FormInputNumberic name='amount' control={control} placeholder='Enter amount' label='Amount' defaultValue={history.withdrawalAmount}/>
        <NumericDisplay value={ history?.balance ?? '-'} label='Balance' />
      </div>
      <div className="flex gap-2 items-center">
        <FormInputText name="psuCode" control={control} label='PSU-code' placeholder='Enter a psucode' defaultValue={ history.psuCode} />
        <FormInputDate name='date' control={control} label='Date' defaultValue={new Date( history.date )}/>
      </div>
      <div className="flex gap-2 items-center">
        <FormInputText name="note" control={control} label='Note' placeholder='Enter a note' multiline defaultValue={ history.note ?? ''}/>
      </div>
      <Button variant="contained" type="submit">Disburse</Button>
    </form>
  )
}

export default FormHistory;