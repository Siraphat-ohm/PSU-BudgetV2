'use client'
import useFetch from "@/lib/hook/useUser";
import { IFacResponse, IUsersResponse } from "@/schema/response";
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
    useDisclosure 
  } from "@nextui-org/react";
import { useState } from "react";
import toast from "react-hot-toast";

const Admin = () => {
  const { error, res, isLoading } = useFetch( "/users" );
  const {isOpen, onOpen, onOpenChange } = useDisclosure();
  const [ info, setInfo ] = useState<IFacResponse[]>([]);

  if ( isLoading ) return <div>Loading...</div>
  if ( error ) return toast.error( error );

  const users = res.data as IUsersResponse[] ;

  const MAX_FACULTIES_TO_DISPLAY = 3; 

  return (
    <div className="mt-5 ml-5 mr-5">
      <Table aria-label="User Table">
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Faculties</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody emptyContent="No rows to display.">
          {users.map((user, index : number) => (
            <TableRow key={user.id} className={index % 2 !== 0 ? "bg-gray-200" : ""}>
              <TableCell className="border border-gray-400 px-4 py-2" width="30%">
                {user.firstname} {user.lastname}
              </TableCell>
              <TableCell className="border border-gray-400 px-4 py-2">
                {user.facs.length > 0 ? (
                  user.facs.length <= MAX_FACULTIES_TO_DISPLAY ? (
                    <ul className="list-disc pl-4">
                      {user.facs.map((fac) => (
                      <li key={fac.id} className="text-gray-600">{fac.fac}</li>
                      ))}
                      </ul>
                    ) : (
                      <div>
                        <ul className="list-disc pl-4">
                          {user.facs.slice(0, MAX_FACULTIES_TO_DISPLAY).map((fac) => (
                            <li key={fac.id} className="text-gray-600">{fac.fac}</li>
                          ))}                { info.map( fac => <p key={fac.id}>{fac.fac}</p>) }
                        </ul>
                        <a onClick={ () => {
                          setInfo( users.find( ( { id }) => id == user.id )?.facs ?? [] )
                          onOpen()
                        }  } className="text-gray-600">+ {user.facs.length - MAX_FACULTIES_TO_DISPLAY} more</a>
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
                    <Button size="sm" color="primary">
                      Edit
                    </Button>
                    <Button size="sm" color="danger">
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col justify-center">Faculties</ModalHeader>
              <ModalBody>
                <ul className="list-disc pl-4">
                  { info.map( fac => <li key={fac.id}>{fac.fac}</li>) }
                </ul>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Done
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