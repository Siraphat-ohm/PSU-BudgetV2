import { Box, Typography } from '@mui/material'
import React from 'react'
import Form from './Form';

const Page = async () => {
  return (
    <Box>
      <Typography variant="h2"> รายงานการเบิกจ่าย </Typography>
      <Form/>
    </Box>
  )
}

export default Page;