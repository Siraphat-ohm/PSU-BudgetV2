import ApiAuth from '@/lib/hook/ApiAuth'
import { Box, Typography } from '@mui/material'
import React from 'react'
import CustomPagination from './pagination'
import TableHistories from './TableHistories'

const getHistoriesPage = async(page: number) => {
    try {
        const res = await ApiAuth.get(`/budgets/histories?page=${page}` )
        return res.data.data
    } catch (error) {
        throw error
    }
}

export default async function Page({ searchParams }: { searchParams?: { page?: string; } }) {

    const currentPage = Number(searchParams?.page) || 1;
    const { maxPage } = await getHistoriesPage(currentPage);
    return (
        <Box className="flex flex-col gap-3 border-solid border-2 border-[#333] rounded-md p-6 ">
            <Typography variant='h2'>Histories</Typography>
            <TableHistories/>
            <CustomPagination totalPages={maxPage}/>
        </Box>
    )
}
