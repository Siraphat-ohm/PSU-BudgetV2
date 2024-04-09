'use client'
import ApiAuth from "@/_lib/hook/ApiAuth";
import useFetch from "@/_lib/hook/useFectch";
import { IUsersResponse } from "@/_schema/response";
import { 
    Table, 
    TableHeader, 
    TableColumn, 
    TableBody, 
    TableRow, 
    TableCell, 
    Button, 
    Modal, 
    ModalBody, 
    ModalContent, 
    ModalFooter, 
    ModalHeader, 
    useDisclosure, 
    user
  } from "@nextui-org/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const Admin = () => {
  const {isOpen, onOpen, onOpenChange } = useDisclosure();
  const {isOpen: deleteModal, onOpen:deleteModalOpen, onOpenChange:onDeleteModalChange } = useDisclosure();

  const [ info, setInfo ] = useState<IUsersResponse | null >(null);
  const router = useRouter();

  const { error, isLoading, data, mutate } = useFetch<IUsersResponse[]>( '/users');

  if ( isLoading ) return <div> Loading...</div>
  if (error)  {
    console.log( error )
    throw new Error( error )
  }

  const MAX_FACULTIES_TO_DISPLAY = 3; 

  const handleDeleteUser = async( id: string ) => {
    try {
      const res = await ApiAuth.delete( `/users/${id}`, );
      toast.success( res.data.message );
      mutate()
    } catch (e) {
      console.log( e )
    }
  }

  return (
    <div className="mt-5 ml-5 mr-5">
      <Table aria-label="User Table">
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Faculties</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody emptyContent="No rows to display.">
          { data?.length != 0 ? data!.map((user, index : number) => (
            <TableRow key={user.id} className={index % 2 !== 0 ? "bg-gray-200" : ""}>
              <TableCell className="border border-gray-400 px-4 py-2" width="30%">
                {user.firstName} {user.lastName}
              </TableCell>
              <TableCell className="border border-gray-400 px-4 py-2">
                {user.faculties.length > 0 ? (
                  user.faculties.length <= MAX_FACULTIES_TO_DISPLAY ? (
                    <ul className="list-disc pl-4">
                      {user.faculties.map((fac) => (
                      <li key={fac.id} className="text-gray-600">{fac.name}</li>
                      ))}
                      </ul>
                    ) : (
                      <div>
                        <ul className="list-disc pl-4">
                          {user.faculties.slice(0, MAX_FACULTIES_TO_DISPLAY).map((fac) => (
                            <li key={fac.id} className="text-gray-600">{fac.name}</li>
                          ))} 
                        </ul>
                        <a onClick={ () => {
                          setInfo( data!.find( ( { id }) => id == user.id ) ?? null )
                          onOpen()
                        }  } className="text-gray-600">+ {user.faculties.length - MAX_FACULTIES_TO_DISPLAY} more</a>
                      </div>
                    )
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className="border border-gray-400" width="10%">
                  <div
                className="flex justify-center items-center gap-1 text-white"
                  >
                    <Button size="sm" color="primary" onClick={ () => router.push( `/admin/users/${user.id}`)}>
                      Edit
                    </Button>
                    <Button size="sm" color="danger" onClick={ () => {
                        setInfo( data!.find( ( { id }) => id == user.id ) ?? null )
                        deleteModalOpen()
                    }}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
            </TableRow>
            )) : [] }
          </TableBody>
        </Table>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col justify-center">Faculties</ModalHeader>
                <ModalBody>
                  <ul className="list-decimal pl-4">
                    { info?.faculties.map( fac => <li key={fac.id}>{fac.name}</li>)}
                  </ul>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onPress={() => {
                    setInfo( null )
                    onClose() }
                  }>
                    Done
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
      </Modal>
      <Modal isOpen={deleteModal} onOpenChange={onDeleteModalChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col justify-center">Confirm</ModalHeader>
                <ModalBody >
                  <span>
                    Do you want delete user <b>{info?.firstName + " " + info?.lastName }</b>
                  </span>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onPress={() => {
                    handleDeleteUser( info!.id )
                    onClose()
                  }}>
                    Done
                  </Button>
                  <Button color="danger" className="text-white" onPress={() => onClose()}>
                    Cancel
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>

      </Modal>
      </div>
    );
};

export default Admin;