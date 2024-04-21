import ApiAuth from '@/hook/ApiAuth'
import { Box, Typography } from '@mui/material'
import React, { Suspense } from 'react'
import CustomPagination from './pagination'
import TableHistories from './TableHistories'
import DateRange from '@/components/Search/Search'

const getTotalHistoryPages = async ( startDate: string, endDate: string ): Promise<number> => {
    try {
        const res = await ApiAuth.get( `/budgets/histories/pages?startDate=${startDate}&endDate=${endDate}` ) 
        return res.data.data
    } catch (error) {
        throw error;
    }
}

export default async function Page({
    searchParams,
}: {
    searchParams?: {
        startDate?: string;
        endDate?: string;
        page?: string;
    };
}) {
    const startDate = searchParams?.startDate || '';
    const endDate = searchParams?.endDate || '';
    const currentPage = Number(searchParams?.page) || 1;

    const totalPages = await getTotalHistoryPages( startDate, endDate );

    return (
        <Box className="flex flex-col">
            <Typography variant='h2'>ประวัติการเบิกจ่าย</Typography>
            <DateRange />
            <Suspense key={startDate + endDate + currentPage} fallback={<p>loading...</p>}>
                <TableHistories currentPage={currentPage} startDate={startDate} endDate={endDate} />
            </Suspense>
            { totalPages ? <CustomPagination totalPages={totalPages} /> : null }
        </Box>
    )
}
