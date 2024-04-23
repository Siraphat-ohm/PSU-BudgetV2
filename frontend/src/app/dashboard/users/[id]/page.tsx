import React from 'react'
import EditUserForm from './EditUserForm'
import ApiAuth from '@/hook/ApiAuth'
import { User } from '@/interfaces/user'
import { Box, Typography } from '@mui/material'
import { getFauculties } from '@/lib/utils'

const getUser = async ( id: string ): Promise<User> => {
    try {
        const res = await ApiAuth.get( `/users/byId/${id}` )
        return res.data.data
    } catch (error) {
        throw error
    }
}


type Props = {
    params: {
        id: string
    }
}

const Page = async( { params: { id } }: Props ) => {
    const user = await getUser( id );
    const faculties = await getFauculties();
  return (
    <Box>
        <Typography variant="h2">Edit the user</Typography>
        <EditUserForm user={user} faculties={faculties}/>
    </Box>
  )
}

export default Page;