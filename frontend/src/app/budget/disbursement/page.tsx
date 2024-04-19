import { Typography } from '@mui/material'
import React, { cache } from 'react'
import DisburementForm from './DisburementForm'

const page = () => {
    return (
        <div className="flex flex-col gap-3 border-solid border-2 border-[#333] rounded-md p-6 w-[50%]">
            <Typography variant="h2"> Disbursement </Typography>
            <DisburementForm/>
        </div>
    )
}

export default page