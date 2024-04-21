'use client';
import { RHFAutocompleteField } from '@/components/Forms/FormAutocomplete';
import { FormInputDate } from '@/components/Forms/FormDatePicker';
import FormInputNumberic, { NumericDisplay } from '@/components/Forms/FormNumbericTextField';
import { FormInputText } from '@/components/Forms/FormTextField';
import ApiAuth from '@/hook/ApiAuth';
import useFetch from '@/hook/useFectch';
import { DisbursedSchema, DisbursedSchemaType } from '@/schemas/budget';
import { EditHitoryDisbursement,  } from '@/types/options';
import { RowDisItemType, RowFacultyType, RowItemType } from '@/types/table-z.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { Typography, Autocomplete, TextField, Chip, Button, Box } from '@mui/material';
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
    <form className='flex flex-col gap-6 mt-3' onSubmit={handleSubmit(onSubmit)} >
      <Box className="flex gap-2 items-center">
        <RHFAutocompleteField name='facultyId' control={control} options={faculties ?? []} placeholder='เลือกคณะ' defaultValue={history.facultyId} />
        <TextField value={history.code}/>
      </Box>
      <Box className="flex gap-2 items-center">
        <FormInputNumberic name='amount' control={control} placeholder='พิมพ์จำนวนเงินที่เบิกจ่าย' label='จำนวนที่เบิกจ่าย' defaultValue={history.withdrawalAmount}/>
        <NumericDisplay value={history.balance ?? ''} label="ยอดเงินคงเหลือ" />
      </Box>
      <Box className="flex gap-2 items-center">
        <FormInputText name="psuCode" control={control} label='เลขที่ ม.อ.' placeholder='พิมพ์เลขที่ ม.อ.' defaultValue={history.psuCode} />
        <FormInputDate name='date' control={control} label='วันที่เบิกจ่าย' defaultValue={new Date( history.date )} />
      </Box>
      <Box className="flex gap-2 items-center">
        <FormInputText name="note" control={control} label='หมายเหตุ' placeholder='พิมพ์หมายเหตุ' multiline defaultValue={history.note ?? ''}/>
      </Box>
      <Button variant="contained" type="submit">แก้ไขการเบิกจ่าย</Button>
    </form>
  )
}

export default FormHistory;