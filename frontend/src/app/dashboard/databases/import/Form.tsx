'use client';
import {
    Button,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
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

    const [open, setOpen] = useState(false);

    const [error, setError] = useState<string>("");

    const handleClose = () => {
        setOpen(false);
    }

    const handleOpen = () => {
        setOpen(true);
    }

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
                setError(message);
                handleOpen();
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
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth='md'
                className="fixed z-10 inset-0 overflow-y-auto"
            >
                        <DialogTitle>
                            Error
                        </DialogTitle>
                        <DialogContent>
                            {error}
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={handleClose}
                                variant='contained'
                                color='error'
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                                Close
                            </Button>
                        </DialogActions>
            </Dialog>
        </form>
    )
}


export default Form;