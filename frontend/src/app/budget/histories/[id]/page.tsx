import ApiAuth from '@/lib/hook/ApiAuth';
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
        <Box className="grid grid-cols-1 gap-6 border-solid border-2 border-[#333] rounded-md p-6 w-[50%]"  >
            { JSON.stringify( history )}
            <Typography variant="h2">Edit Disbursed</Typography>
            <FormHistory history={history} />
        </Box>
    )
}

export default page