import { Faculty } from '@/schema/tables/faculty';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'
import React from 'react'

type Props = {
    faculties: Faculty[];
}

const FacultyTable = ( { faculties }: Props ) => {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell className="border border-[#444]">Id</TableCell>
                    <TableCell className="border border-[#444]">Name</TableCell>
                    <TableCell className="border border-[#444]">User Id</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {( faculties ).map(( { id, name, userId}, index) => {
                    return (
                        <TableRow key={index} className={index % 2 === 0 ? "bg-[#333]" : ""}>
                            <TableCell className="border border-[#444]">{id}</TableCell>
                            <TableCell className="border border-[#444]">{name}</TableCell>
                            <TableCell className="border border-[#444]">{userId ?? '-'}</TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}

export default FacultyTable
