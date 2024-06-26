import { Box, Typography } from '@mui/material'
import React, { Suspense } from 'react'
import CustomPagination from '../../../components/Search/Pagination'
import TableHistories from './Table'
import DateRange from '@/components/Search/DateRange'
import { getTotalHistoryPages } from '@/lib/utils'
import Search from '@/components/Search/Search'

export default async function Page({
    searchParams,
}: {
    searchParams?: {
        startDate?: string;
        endDate?: string;
        page?: string;
        psuCode?: string;
    };
}) {
    const startDate = searchParams?.startDate || '';
    const endDate = searchParams?.endDate || '';
    const currentPage = Number(searchParams?.page) || 1;
    const searchTerm = searchParams?.psuCode || '';

    const totalPages = await getTotalHistoryPages( startDate, endDate );

    return (
        <Box className="flex flex-col">
            <Typography variant='h2'>ประวัติการเบิกจ่าย</Typography>
            <Box className="flex mt-3 gap-3">
                <DateRange />
                <Search placeholder="ค้นหาเลขที่ ม.อ." />
            </Box>
            <Suspense key={startDate + endDate + currentPage} fallback={<p>loading...</p>}>
                <TableHistories currentPage={currentPage} startDate={startDate} endDate={endDate} seachTerm={searchTerm}/>
            </Suspense>
            { totalPages ? <CustomPagination totalPages={totalPages} /> : null }
        </Box>
    )
}
