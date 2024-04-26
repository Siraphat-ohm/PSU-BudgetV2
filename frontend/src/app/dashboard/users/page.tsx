import { User } from '@/interfaces/user';
import ApiAuth from '@/hook/ApiAuth'
import { Box, List, ListItem, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import React from 'react'
import { DeleteButton } from '@/components/Buttons/DeletButton';
import { EditButton } from '@/components/Buttons/EditButton';
import DialogFaculties from '@/components/misc/ShowFaculties';
import { MAX_FACULTIES_TO_DISPLAY } from '@/lib/mappings';

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
            <Box className="flex flex-col mt-3">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell className="border border-[#444]">Name</TableCell>
                            <TableCell className="border border-[#444]">Faculties</TableCell>
                            <TableCell className="border border-[#444]">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user, index) => (
                            <TableRow key={user.id} className={index % 2 !== 0 ? "bg-[#333]" : ""}>
                                <TableCell className="border border-[#444]">{user.firstName} {user.lastName}</TableCell>
                                <TableCell className="border border-[#444]">
                                    {user.faculties.length > 0 ? (
                                        <List>
                                            {user.faculties.slice(0, MAX_FACULTIES_TO_DISPLAY).map((fac, index) => (
                                                <ListItem key={fac.id}>{index + 1}. {fac.name}</ListItem>
                                            ))}
                                            {user.faculties.length > MAX_FACULTIES_TO_DISPLAY && (
                                                <DialogFaculties user={user} />
                                            )}
                                        </List>
                                    ) : "-"}
                                </TableCell>
                                <TableCell className="border border-[#444]" width="10%">
                                    <div className="flex justify-center items-center gap-1">
                                        <EditButton id={user.id} />
                                        <DeleteButton item={user} path="users" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </Box>
    )
}

export default page
