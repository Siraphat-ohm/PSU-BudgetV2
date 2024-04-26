import { DisItem } from '@/schema/tables/disItem';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import React from 'react'

type Props = {
    disItems: DisItem[];
}

const DisItemTable = ( { disItems } : Props ) => {
    return (
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
                </TableRow>
            </TableHead>
            <TableBody>
                {(disItems).map(({ id, date, itemcode, note, psuCode, userId , withdrawalAmount}, index) => {
                    return (
                        <TableRow key={index} className={index % 2 === 0 ? "bg-[#333]" : ""}>
                            <TableCell className="border border-[#444]">{id}</TableCell>
                            <TableCell className="border border-[#444]">{itemcode}</TableCell>
                            <TableCell className="border border-[#444]">{psuCode}</TableCell>
                            <TableCell className="border border-[#444]">{withdrawalAmount}</TableCell>
                            <TableCell className="border border-[#444]">{userId}</TableCell>
                            <TableCell className="border border-[#444]">{date}</TableCell>
                            <TableCell className="border border-[#444]">{note}</TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>

    )
}

export default DisItemTable;