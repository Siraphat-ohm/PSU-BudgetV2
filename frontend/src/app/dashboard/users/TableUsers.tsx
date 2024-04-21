"use client";

import ApiAuth from "@/hook/ApiAuth";
import { Button, Table, TableHead, TableBody, TableRow, TableCell, Link, List, ListItem, Dialog, DialogActions, DialogContent, DialogTitle, Box } from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { User } from "@/interfaces/user";

type Props = {
  users: User[]
}

const TableUsers = ({
  users
}: Props) => {
  const router = useRouter();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);


  const MAX_FACULTIES_TO_DISPLAY = 3;

  const handleOpenDeleteDialog = (user: User) => {
    setUserToDelete(user);
    setOpenDeleteDialog(true);
  }


  const handleCloseDeleteDialog = () => {
    setUserToDelete(null)
    setOpenDeleteDialog(false);
  }

  const handleConfirmDelete = async (id: number) => {
    try {
      const res = await ApiAuth.delete(`/users/${id}`);
      toast.success(res.data.message);
      router.refresh()
      handleCloseDeleteDialog();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleViewMoreFaculties = (user: User) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  return (
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
                      <ListItem>
                        <Link onClick={() => handleViewMoreFaculties(user)}>+ {user.faculties.length - MAX_FACULTIES_TO_DISPLAY} more</Link>
                      </ListItem>
                    )}
                  </List>
                ) : "-"}
              </TableCell>
              <TableCell className="border border-[#444]" width="10%">
                <div className="flex justify-center items-center gap-1">
                  <Button color="primary" variant="contained" onClick={() => router.push(`/dashboard/users/${user.id}`)}>Edit</Button>
                  <Button color="error" variant="contained" onClick={() => handleOpenDeleteDialog(user)}>Delete</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
          Are you sure you want to delete <b>{userToDelete?.firstName} {userToDelete?.lastName}</b>?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={() => handleConfirmDelete(userToDelete!.id)} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );


};

export default TableUsers;
