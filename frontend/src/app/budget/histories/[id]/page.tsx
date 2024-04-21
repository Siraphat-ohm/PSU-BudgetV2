import ApiAuth from '@/hook/ApiAuth';
import { EditHitoryDisbursement } from '@/types/options';
import React from 'react'
import FormHistory from './FormHistory';
import { Box, Typography } from '@mui/material';

type Props = {
    params: {
        id: string
    }
};

const getHistory = async (id: string): Promise<EditHitoryDisbursement> => {
    try {
        const res = await ApiAuth.get(`/budgets/histories/${id}`)
        return res.data.data
    } catch (e) {
        throw e;
    }
}

const page = async ({ params: { id } }: Props) => {
    const history = await getHistory(id);
    return (
        <Box>
            <Typography variant="h2">แก้ไขประวัติการเบิกจ่าย</Typography>
            <FormHistory history={history} />
        </Box>
    )
}

export default page