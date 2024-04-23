'use client'
import { User } from '@/interfaces/user';
import { MAX_FACULTIES_TO_DISPLAY } from '@/lib/constants';
import { Dialog, DialogTitle, DialogContent, List, ListItem, DialogActions, Button, Link } from '@mui/material';
import React, { useState } from 'react'

const DialogFaculties = ({ user }: { user: User }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedUser(null);
    };
    const handleViewMoreFaculties = (user: User) => {
        setSelectedUser(user);
        setOpenDialog(true);
    };

    return (
        <>
            <ListItem>
                <Link onClick={() => handleViewMoreFaculties(user)}>+ {user.faculties.length - MAX_FACULTIES_TO_DISPLAY} more</Link>
            </ListItem>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Faculties for {selectedUser?.firstName} {selectedUser?.lastName}</DialogTitle>
                <DialogContent>
                    <List>
                        {selectedUser?.faculties.map((fac, index) => (
                            <ListItem key={fac.id}>{index + 1}. {fac.name}</ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default DialogFaculties
