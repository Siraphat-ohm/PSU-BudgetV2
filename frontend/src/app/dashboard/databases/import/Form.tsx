'use client';
import {
    Button,
    Box,
} from '@mui/material';
import React, { useState } from 'react';
import { AxiosError } from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { processFile } from '@/lib/fileUtils';
import ApiAuth from '@/hook/ApiAuth';
import { RHFAutocompleteField } from '@/components/Forms/FormAutocomplete';
import { HEADER_MAPPINGS, IMOPORT_ENDPOINT_MAPPINGS, IMPORT_FORM_OPTIONS } from '@/lib/mappings';
import { TableSelectSchema, TableSelectType } from '@/schema/form/TableSelect';
import { 
    ItemcodeTable, 
    FacultyTable, 
    ItemTypeTable, 
    ProductTable, 
    DisItemTable, 
    FiscalYearTable, 
    PlanTable 
} from '@/components/Tables/Table';

const Form = () => {
    const {
        handleSubmit,
        formState: { errors },
        control,
        watch
    } = useForm<TableSelectType>({ resolver: zodResolver(TableSelectSchema) });

    const [dataExcel, setDataExcel] = useState<any[]>([]);

    const table = watch("table")

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file && table) {
            try {
                const data = await processFile(file, table, HEADER_MAPPINGS);
                setDataExcel(data);
            } catch (error: any) {
                toast.error(error.message || "Unexpected error occurred");
            }
        } else {
            toast.error("Table or file not found");
        }
    };

    const onSubmit: SubmitHandler<TableSelectType> = async (data) => {
        try {
            const { table } = data;
            if (table in IMOPORT_ENDPOINT_MAPPINGS) {
                const endpoint: string = IMOPORT_ENDPOINT_MAPPINGS[table];
                console.log(dataExcel);
                
                const res = await ApiAuth.post(`${endpoint}`, dataExcel)
                toast.success(res.data.message);
            } else {
                throw Error("Invalid Table")
            }
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
        <form className='flex flex-col gap-6 mt-3' onSubmit={handleSubmit(onSubmit)}>
            <Box>
                <RHFAutocompleteField options={IMPORT_FORM_OPTIONS} control={control} name="table" placeholder="Table" />
            </Box>
            <input type="file" onChange={handleFileUpload} accept='.xlsx' />
            <Button type='submit' variant='contained'> Import </Button>
            <Box>
                {dataExcel.length > 0 && (
                    <>
                        {table === "1" && <ItemcodeTable itemcodes={dataExcel} />}
                        {table === "2" && <FacultyTable faculties={dataExcel} />}
                        {table === "3" && <ItemTypeTable itemTypes={dataExcel} />}
                        {table === "4" && <ProductTable products={dataExcel} />}
                        {table === "5" && <DisItemTable disItems={dataExcel} />}
                        {table === "6" && <FiscalYearTable ficalYears={dataExcel} />}
                        {table === "7" && <PlanTable plans={dataExcel} />}
                    </>
                )}
            </Box>
        </form>
    )
}


export default Form;