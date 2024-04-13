'use client';
import { Button, Table, TableBody, TableCell, TableRow, Typography, TableHead } from '@mui/material';
import React, { useState } from 'react';
import { AxiosError, AxiosResponse } from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from 'react-hot-toast';
import { RHFAutocompleteField } from '@/components/FormAutocomplete';
import { RowDisItem, RowFaculty, RowFiscalYear, RowItem, RowItemCategory, RowPlan, RowProduct, TableSchema } from '@/schemas/table.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { processFile } from '@/lib/fileUtils';
import { IHeaderMappings, RowDisItemType, RowFacultyType, RowItemCategoryType, RowItemType, RowPlanType, RowProductType, TableSchemaType } from '@/interfaces/table.inteface';
import ApiAuth from '@/lib/hook/ApiAuth';

const OPTIONS = [
    { id: "1", label: "Items" },
    { id: "2", label: "Faculties" },
    { id: "3", label: "Item Types" },
    { id: "4", label: "Products" },
    { id: "5", label: "Disbursed Items" },
    { id: "6", label: "Fiscal Years" },
    { id: "7", label: "Plans" }
];

const ENDPOINT_MAPPINGS = {
    "1": "/items",
    "2": "/faculties",
    "3": "/itemTypes",
    "4": "/products",
    "5": "/disbursedItems",
    "6": "/fiscalYears",
    "7": "/plans",
}

const HEADER_MAPPINGS: IHeaderMappings = {
    "1": RowItem,
    "2": RowFaculty,
    "3": RowItemCategory,
    "4": RowProduct,
    "5": RowDisItem,
    "6": RowFiscalYear,
    "7": RowPlan,
};


const Page = () => {
    const {
        handleSubmit,
        formState: { errors },
        control,
        watch
    } = useForm<TableSchemaType>({ resolver: zodResolver(TableSchema) });

    const [dataExcel, setDataExcel] = useState<any[]>([]);


    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const table = watch("table");

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

    const onSubmit: SubmitHandler<TableSchemaType> = async (data) => {
        try {
            const { table } = data;
            if ( table in ENDPOINT_MAPPINGS ){
                const endpoint = ENDPOINT_MAPPINGS[table];
                const res = await ApiAuth.post( `/tables/${endpoint}`, dataExcel )
                toast.success( res.data.message );
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
        <form className="grid grid-cols-1 gap-6 border-solid border-2 border-[#333] rounded-md p-6" onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h2">Import Data</Typography>
            <RHFAutocompleteField options={OPTIONS} control={control} name="table" placeholder="Table" />
            <input type="file" onChange={handleFileUpload} accept='.xlsx' />
            <Button type='submit' variant='contained'> Import </Button>
            <div>
                {dataExcel.length > 0 && watch("table") === "1" &&
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell className="border border-[#444]">Code</TableCell>
                                <TableCell className="border border-[#444]">Name</TableCell>
                                <TableCell className="border border-[#444]">Total amount</TableCell>
                                <TableCell className="border border-[#444]">Balance</TableCell>
                                <TableCell className="border border-[#444]">Status</TableCell>
                                <TableCell className="border border-[#444]">Faculty Id</TableCell>
                                <TableCell className="border border-[#444]">Product Id</TableCell>
                                <TableCell className="border border-[#444]">Type Id</TableCell>
                                <TableCell className="border border-[#444]">Fiscal year Id</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(dataExcel as RowItemType[]).map((item, index) => {
                                return (
                                    <TableRow key={index} className={ index % 2 === 0 ? "bg-[#333]" : ""}>
                                        <TableCell className="border border-[#444]">{item.code}</TableCell>
                                        <TableCell className="border border-[#444]">{item.name}</TableCell>
                                        <TableCell className="border border-[#444]">{item.totalAmount}</TableCell>
                                        <TableCell className="border border-[#444]">{item.balance}</TableCell>
                                        <TableCell className="border border-[#444]">{item.status}</TableCell>
                                        <TableCell className="border border-[#444]">{item.facultyId}</TableCell>
                                        <TableCell className="border border-[#444]">{item.productId}</TableCell>
                                        <TableCell className="border border-[#444]">{item.typeId}</TableCell>
                                        <TableCell className="border border-[#444]">{item.fiscalYearId}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>}
                {dataExcel.length > 0 && watch("table") == "2" &&
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell className="border border-[#444]">Id</TableCell>
                                <TableCell className="border border-[#444]">Name</TableCell>
                                <TableCell className="border border-[#444]">User Id</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(dataExcel as RowFacultyType[]).map((item, index) => {
                                return (
                                    <TableRow key={index} className={ index % 2 === 0 ? "bg-[#333]" : ""}>
                                        <TableCell  className="border border-[#444]">{item.id}</TableCell>
                                        <TableCell  className="border border-[#444]">{item.name}</TableCell>
                                        <TableCell  className="border border-[#444]">{item.userId ?? '-'}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                }
                {dataExcel.length > 0 && watch("table") == "3" &&
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell className="border border-[#444]">Id</TableCell>
                                <TableCell className="border border-[#444]">Name</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(dataExcel as RowItemCategoryType[]).map((item, index) => {
                                return (
                                    <TableRow key={index} className={ index % 2 === 0 ? "bg-[#333]" : ""}>
                                        <TableCell className='border border-[#444]'>{item.id}</TableCell>
                                        <TableCell className='border border-[#444]'>{item.name}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                }
                {dataExcel.length > 0 && watch("table") == "4" &&
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell className="border border-[#444]">Id</TableCell>
                                <TableCell className="border border-[#444]">Name</TableCell>
                                <TableCell className="border border-[#444]">Plan Id</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(dataExcel as RowProductType[]).map((item, index) => {
                                return (
                                    <TableRow key={index} className={ index % 2 === 0 ? "bg-[#333]" : ""}>
                                        <TableCell className="border border-[#444]">{item.id}</TableCell>
                                        <TableCell className="border border-[#444]">{item.name}</TableCell>
                                        <TableCell className="border border-[#444]">{item.planId}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                }
                {dataExcel.length > 0 && watch("table") == "5" &&
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell className="border border-[#444]">Id</TableCell>
                                <TableCell className="border border-[#444]">Itemcode</TableCell>
                                <TableCell className="border border-[#444]">PsuCode</TableCell>
                                <TableCell className="border border-[#444]">Withdrawal amount</TableCell>
                                <TableCell className="border border-[#444]">Useri Id</TableCell>
                                <TableCell className="border border-[#444]">Date</TableCell>
                                <TableCell className="border border-[#444]">Note</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(dataExcel as RowDisItemType[]).map((item, index) => {
                                return (
                                    <TableRow key={index} className={ index % 2 === 0 ? "bg-[#333]" : ""}>
                                        <TableCell className="border border-[#444]">{item.id}</TableCell>
                                        <TableCell className="border border-[#444]">{item.itemcode}</TableCell>
                                        <TableCell className="border border-[#444]">{item.psuCode}</TableCell>
                                        <TableCell className="border border-[#444]">{item.withdrawalAmount}</TableCell>
                                        <TableCell className="border border-[#444]">{item.userId}</TableCell>
                                        <TableCell className="border border-[#444]">{item.date}</TableCell>
                                        <TableCell className="border border-[#444]">{item.note}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                }
                {dataExcel.length > 0 && watch("table") == "6" &&
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell className="border border-[#444]">Id</TableCell>
                                <TableCell className="border border-[#444]">Name</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(dataExcel as RowFacultyType[]).map((item, index) => {
                                return (
                                    <TableRow key={index} className={ index % 2 === 0 ? "bg-[#333]" : ""}>
                                        <TableCell className="border border-[#444]">{item.id}</TableCell>
                                        <TableCell className="border border-[#444]">{item.name}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                }
                {dataExcel.length > 0 && watch("table") == "7" &&
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell className="border border-[#444]">ID</TableCell>
                                <TableCell className="border border-[#444]">Name</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody >
                            {(dataExcel as RowPlanType[]).map((item, index) => {
                                return (
                                    <TableRow key={index} className={ index % 2 === 0 ? "bg-[#333]" : ""}>
                                        <TableCell className="border border-[#444]">{item.id}</TableCell>
                                        <TableCell className="border border-[#444]">{item.name}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                }
            </div>
        </form>
    )
}


export default Page;