import ApiAuth from '@/hook/ApiAuth'
import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import Form from './Form';

const getAllFiscalYear = async () => {
    try {
        const res = await ApiAuth.get( '/fiscal-year' );
        return res.data.data;
    } catch (e) {
        throw e; 
    }
}

const Page = async() => {
    const fiscalYears = await getAllFiscalYear();
    return (
        <Box>
            <Typography variant='h2'>Change Fiscal year</Typography>
            <Form fiscalYears={fiscalYears}/>
        </Box>
    )
}

export default Page
