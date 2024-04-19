import { Typography, Box } from '@mui/material'
import React from 'react'
import ImportTableForm from './ImportTableForm'

const Page = () => {
  return (
    <Box>
      <Typography variant="h2">Import Data</Typography>
      <ImportTableForm />
    </Box>
  )
}

export default Page
