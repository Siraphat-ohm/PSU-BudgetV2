'use client'
import ApiAuth from "@/hook/ApiAuth";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export const DeleteButton = ( { item, path } : { 
    item : any,
    path: string
} ) => {
    const router = useRouter()

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const handleOpenDeleteDialog = (item: any) => {
        setOpenDeleteDialog(true);
    }

    const handleConfirmDelete = async (id: number) => {
        try {
            const res = await ApiAuth.delete(`/${path}/${id}`);
            toast.success(res.data.message);
            handleCloseDeleteDialog()
            router.refresh()
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };


    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    }

    return (
        <>
            <Button color="error" variant="contained" onClick={() => handleOpenDeleteDialog(history)}>Delete</Button>
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete <b>{item?.id}</b>?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                    <Button onClick={() => handleConfirmDelete(item!.id)} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}