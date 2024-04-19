import { Box, Typography } from '@mui/material'
import React from 'react'
import RegisterForm from './RegisterForm'

const page = () => {
  return (
    <Box>
        <Typography variant="h2">Register User</Typography>
        <RegisterForm/>
    </Box>
  )
}

export default page