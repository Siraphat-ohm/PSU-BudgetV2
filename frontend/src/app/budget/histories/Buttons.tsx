'use client';
import ApiAuth from '@/hook/ApiAuth'
import { User } from '@/interfaces/user'
import { HistoriesDisbursement } from '@/types/options';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem } from '@mui/material'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

export const EditButton = (  { id } : { id: string | number }) => {
    const router = useRouter()
    const pathname = usePathname()
    return (
        <Button color="primary" variant="contained" onClick={() => router.push(`${pathname}/${id}`)}>Edit</Button>
    )
}

export const DeleteButton = ( { history } : { history : HistoriesDisbursement } ) => {
    const router = useRouter()

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);


    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<HistoriesDisbursement | null>(null);

    const handleOpenDeleteDialog = (item: any) => {
        setItemToDelete(item);
        setOpenDeleteDialog(true);
    }

    const handleConfirmDelete = async (id: number) => {
        try {
            const res = await ApiAuth.delete(`/budgets/disbursed/${id}`);
            toast.success(res.data.message);
            handleCloseDeleteDialog()
            router.refresh()
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };


    const handleCloseDeleteDialog = () => {
        setItemToDelete(null)
        setOpenDeleteDialog(false);
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedUser(null);
    };


    return (
        <>
            <Button color="error" variant="contained" onClick={() => handleOpenDeleteDialog(history)}>Delete</Button>
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
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete <b>{itemToDelete?.id}</b>?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                    <Button onClick={() => handleConfirmDelete(itemToDelete!.id)} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}