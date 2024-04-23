'use client';
import { RHFAutocompleteField } from '@/components/Forms/FormAutocomplete';
import { FormInputDate } from '@/components/Forms/FormDatePicker';
import FormInputNumberic, { NumericDisplay } from '@/components/Forms/FormNumbericTextField';
import { FormInputText } from '@/components/Forms/FormTextField';
import ApiAuth from '@/hook/ApiAuth';
import useFetch from '@/hook/useFectch';
import { DisbursedSchema, DisbursedSchemaType } from '@/schema/form/Disbursement';
import { DisItem } from '@/schema/tables/disItem';
import { Faculty } from '@/schema/tables/faculty';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Box } from '@mui/material';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';


type Props = {
  history: DisItem & { codeId: string; code: string; facultyId: string; faculty: string; balance: string | null},
  faculties: Faculty[]
}

const Form = (  { history, faculties } : Props ) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<DisbursedSchemaType>({
    resolver: zodResolver(DisbursedSchema),
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<DisbursedSchemaType> = async (data) => {
    try {
      const { codeId } = history;
      const res = await ApiAuth.put( `/disItems/${history.id}`, { ...data, codeId });
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

export default Form;