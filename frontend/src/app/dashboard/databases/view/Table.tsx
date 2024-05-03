
import { 
    FacultyTable, 
    DisItemTable, 
    ItemcodeTable, 
    ProductTable,
    ItemTypeTable,
    FiscalYearTable,
    PlanTable} from '@/components/Tables/Table';
import ApiAuth from '@/hook/ApiAuth';
import { IMOPORT_ENDPOINT_MAPPINGS } from '@/lib/mappings';
import { Box } from '@mui/material'
import React from 'react'

const getDataTable = async (table: string) => {
    try {
        if (table && table in IMOPORT_ENDPOINT_MAPPINGS) {
            const res = await ApiAuth.get(`${IMOPORT_ENDPOINT_MAPPINGS[table]}`)
            return res.data.data;
        }
        return null;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const RenderTable = async ({ table }: { table: string }) => {
    const data = await getDataTable(table);
    return (
        <Box>
                {table === "1" && <ItemcodeTable itemcodes={data}/>}
                {table === "2" && <FacultyTable faculties={data}/>}
                {table === "3" && <ItemTypeTable itemTypes={data}/>}
                {table === "4" && <ProductTable products={data} />}
                {table === "5" && <DisItemTable disItems={data}/>}
                {table === "6" && <FiscalYearTable ficalYears={data}/>}
                {table === "7" && <PlanTable plans={data}/>}
        </Box>
    )
}

export default RenderTable