'use client';
import ApiAuth from '@/lib/hook/ApiAuth';
import useFetch from '@/lib/hook/useFectch';
import { HistoriesDisbursement } from '@/types/options';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Pagination, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react'
import toast from 'react-hot-toast';

type res = {
    histories: HistoriesDisbursement[]
    maxPage: number
}

const TableHistories = () => {
    const searchParams = useSearchParams()
    const pathname = usePathname()

    const page = searchParams.get("page") ?? "1"
    const router = useRouter()

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<HistoriesDisbursement | null>(null);

    const { data, error: historiesError, isLoading: historiesLoading, mutate } = useFetch<res>(`/budgets/histories?page=${page}`);

    const handleOpenDeleteDialog = (item: any) => {
        setItemToDelete(item);
        setOpenDeleteDialog(true);
    }

    const handleConfirmDelete = async (id: number) => {
        try {
            const res = await ApiAuth.delete(`/budgets/disbursed/${id}`);
            toast.success(res.data.message);
            mutate();
            handleCloseDeleteDialog()
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };


    const handleCloseDeleteDialog = () => {
        setItemToDelete(null)
        setOpenDeleteDialog(false);
    }

    if (historiesLoading) return <p>Loading...</p>

    return (
        <>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell className="border border-[#444]">Id</TableCell>
                        <TableCell className="border border-[#444]">Itemcode</TableCell>
                        <TableCell className="border border-[#444]">PsuCode</TableCell>
                        <TableCell className="border border-[#444]">Withdrawal amount</TableCell>
                        <TableCell className="border border-[#444]">Useri Id</TableCell>
                        <TableCell className="border border-[#444]">Date</TableCell>
                        <TableCell className="border border-[#444]">Note</TableCell>
                        <TableCell className="border border-[#444]">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(data.histories).map((item, index) => {
                        return (
                            <TableRow key={index} className={index % 2 === 0 ? "bg-[#333]" : ""}>
                                <TableCell className="border border-[#444]">{item.id}</TableCell>
                                <TableCell className="border border-[#444]">{item.code}</TableCell>
                                <TableCell className="border border-[#444]">{item.psuCode}</TableCell>
                                <TableCell className="border border-[#444]">{item.withdrawalAmount}</TableCell>
                                <TableCell className="border border-[#444]">{item.userId}</TableCell>
                                <TableCell className="border border-[#444]">{item.date}</TableCell>
                                <TableCell className="border border-[#444]">{item.note}</TableCell>
                                <TableCell className="border border-[#444]" width="10%">
                                    <div className="flex justify-center items-center gap-1">
                                        <Button color="primary" variant="contained" onClick={() => router.push(`${pathname}/${item.id}`)}>Edit</Button>
                                        <Button color="error" variant="contained" onClick={() => handleOpenDeleteDialog(item)}>Delete</Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete <b>{ itemToDelete?.id  }</b>?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                    <Button onClick={() => handleConfirmDelete(itemToDelete!.id)} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default TableHistories;