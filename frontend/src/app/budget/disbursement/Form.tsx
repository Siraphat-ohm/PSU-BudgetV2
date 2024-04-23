'use client';
import { RHFAutocompleteField } from '@/components/Forms/FormAutocomplete';
import { FormInputDate } from '@/components/Forms/FormDatePicker';
import FormInputNumberic, { NumericDisplay } from '@/components/Forms/FormNumbericTextField';
import { FormInputText } from '@/components/Forms/FormTextField';
import ApiAuth from '@/hook/ApiAuth';
import useFetch from '@/hook/useFectch';
import { DisbursedSchemaType, DisbursedSchema } from '@/schema/form/Disbursement';
import { Faculty } from '@/schema/tables/faculty';
import { Itemcode } from '@/schema/tables/Itemcode';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button } from '@mui/material';
import { AxiosError } from 'axios';
import React from 'react'
import { SubmitHandler, useForm  } from 'react-hook-form';
import toast from 'react-hot-toast';

type Props = {
  faculties: Faculty[];
}

const DisbrusementForm = ( { faculties }: Props ) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
    reset
  } = useForm<DisbursedSchemaType>({ resolver: zodResolver(DisbursedSchema) });


  const facultyId = watch("facultyId");
  const { data: codes, error: codesError } = useFetch<Itemcode[]>(facultyId ? `/itemcodes/${facultyId}` : "")

  const onSubmit: SubmitHandler<DisbursedSchemaType> = async (data) => {
    try {
      const res = await ApiAuth.post("/disitems", data);
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

  if ( codesError ) throw new codesError

  return (
    <form className="flex flex-col gap-6 mt-3" onSubmit={handleSubmit(onSubmit)} >
      <Box className="flex gap-2 items-center">
        <RHFAutocompleteField name='facultyId' control={control} options={faculties ?? []} placeholder='เลือกคณะ' />
        <RHFAutocompleteField name='codeId' control={control} options={codes ?? []} placeholder='เลือก Itemcode' />
      </Box>
      <Box className="flex gap-2 items-center">
        <FormInputNumberic name='amount' control={control} placeholder='พิมพ์จำนวนเงินที่เบิกจ่าย' label='จำนวนที่เบิกจ่าย' defaultValue={''}/>
        <NumericDisplay value={codes ? codes.find(code => code.id === watch("codeId"))?.balance : ''} label="ยอดเงินคงเหลือ" />
      </Box>
      <Box className="flex gap-2 items-center">
        <FormInputText name="psuCode" control={control} label='เลขที่ ม.อ.' placeholder='พิมพ์เลขที่ ม.อ.' defaultValue='' />
        <FormInputDate name='date' control={control} label='วันที่เบิกจ่าย' />
      </Box>
      <Box className="flex gap-2 items-center">
        <FormInputText name="note" control={control} label='หมายเหตุ' placeholder='พิมพ์หมายเหตุ' multiline defaultValue=''/>
      </Box>
      <Button variant="contained" type="submit">เบิกจ่าย</Button>
    </form>
  )
}

export default DisbrusementForm;