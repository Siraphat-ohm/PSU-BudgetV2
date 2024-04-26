import { Box, Typography } from '@mui/material'
import React from 'react'
import DisbrusementForm from './Form';
import { getFaucultiesByUserId } from '@/lib/utils';

const Page = async () => {
    const faculties = await getFaucultiesByUserId(); 
    return (
        <Box>
            <Typography variant="h2"> การเบิกจ่าย </Typography>
            <DisbrusementForm faculties={faculties}/>
        </Box>
    )
}

export default Page;