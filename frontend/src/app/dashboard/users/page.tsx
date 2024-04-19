import { User } from '@/interfaces/user';
import ApiAuth from '@/lib/hook/ApiAuth'
import { Box, Typography } from '@mui/material'
import React from 'react'
import TableUsers from './TableUsers';

const getUsers = async (): Promise<User[]> => {
    try {
        const res = await ApiAuth.get('/users');
        return res.data.data
    } catch (error) {
        throw error;
    }
}

const page = async () => {
    const users = await getUsers();
    return (
        <Box>
            <Typography variant="h2">Table Views</Typography>
            <TableUsers users={users}/>
        </Box>
    )
}

export default page
