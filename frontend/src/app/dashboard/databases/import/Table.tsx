'use client';
import { 
    Button, 
    Box
} from '@mui/material';
import React, { useState } from 'react';
import { AxiosError  } from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { processFile } from '@/lib/fileUtils';
import ApiAuth from '@/hook/ApiAuth';
import { RHFAutocompleteField } from '@/components/Forms/FormAutocomplete';
import ItemcodeTable from '@/components/Tables/Import/ItemcodeTable';
import FacultyTable from '@/components/Tables/Import/FacultyTable';
import { HEADER_MAPPINGS, IMOPORT_ENDPOINT_MAPPINGS, IMPORT_FORM_OPTIONS } from '@/lib/mappings';
import { Itemcode } from '@/schema/tables/Itemcode';
import { Product } from '@/schema/tables/Product';
import { DisItem } from '@/schema/tables/disItem';
import { Faculty } from '@/schema/tables/faculty';
import { ItemType } from '@/schema/tables/itemType';
import { Plan } from '@/schema/tables/plan';
import { FiscalYear } from '@/schema/tables/fiscalYear';
import { TableSelectSchema, TableSelectType } from '@/schema/form/TableSelect';
import ProductTable from '@/components/Tables/Import/ProductTable';
import DisItemTable from '@/components/Tables/Import/DisItemTable';
import FiscalYearTable from '@/components/Tables/Import/FiscalYearTable';
import ItemTypeTable from '@/components/Tables/Import/ItemTypeTable';
import PlanTable from '@/components/Tables/Import/PlanTable';

const Table = () => {
    const {
        handleSubmit,
        formState: { errors },
        control,
        watch
    } = useForm<TableSelectType>({ resolver: zodResolver( TableSelectSchema ) });

    const [dataExcel, setDataExcel] = useState<any[]>([]);

    const table = watch("table")

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file && table) {
            try {
                const data = await processFile( file, table, HEADER_MAPPINGS );
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
            if ( table in IMOPORT_ENDPOINT_MAPPINGS ){
                const endpoint: string = IMOPORT_ENDPOINT_MAPPINGS[table];
                const res = await ApiAuth.post( `${endpoint}`, dataExcel )
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
        <form className='flex flex-col gap-6 mt-3' onSubmit={handleSubmit(onSubmit)}>
            <RHFAutocompleteField options={IMPORT_FORM_OPTIONS} control={control} name="table" placeholder="Table" />
            <input type="file" onChange={handleFileUpload} accept='.xlsx' />
            <Button type='submit' variant='contained'> Import </Button>
            <Box>
                {dataExcel.length > 0 && (
                    <>
                        {table === "1" && <ItemcodeTable itemcodes={dataExcel as Itemcode[]} />}
                        {table === "2" && <FacultyTable faculties={dataExcel as Faculty[]} />}
                        {table === "3" && <ItemTypeTable itemTypes={dataExcel as ItemType[]} />}
                        {table === "4" && <ProductTable products={dataExcel as Product[]} />}
                        {table === "5" && <DisItemTable disItems={dataExcel as DisItem[]} />}
                        {table === "6" && <FiscalYearTable fiscalYears={dataExcel as FiscalYear[]} />}
                        {table === "7" && <PlanTable plans={dataExcel as Plan[]} />}
                    </>
                )}
            </Box>
        </form>
    )

}


export default Table;