import { Box, Typography } from '@mui/material'
import React from 'react'
import DisburementForm from './DisburementForm'

const Page = () => {
    return (
        <Box>
            <Typography variant="h2"> การเบิกจ่าย </Typography>
            <DisburementForm/>
        </Box>
    )
}

export default Page;