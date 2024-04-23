import React from 'react'
import { Box, Typography } from '@mui/material';
import { getFauculties, getHistory } from '@/lib/utils';
import Form from './Form';

type Props = {
    params: {
        id: string
    }
};


const Page = async ({ params: { id } }: Props) => {
    const faculties = await getFauculties();
    const history = await getHistory(id);
    return (
        <Box>
            <Typography variant="h2">แก้ไขประวัติการเบิกจ่าย</Typography>
            <Form history={history} faculties={faculties} />
        </Box>
    )
}

export default Page;