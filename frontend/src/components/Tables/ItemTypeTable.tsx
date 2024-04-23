import { ItemType } from '@/schema/tables/itemType';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import React from 'react'

type Props = {
    itemTypes: ItemType[];
}

const ItemTypeTable = ({ itemTypes }: Props) => {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell className="border border-[#444]">Id</TableCell>
                    <TableCell className="border border-[#444]">Name</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {(itemTypes).map(( { id, name }, index) => {
                    return (
                        <TableRow key={index} className={index % 2 === 0 ? "bg-[#333]" : ""}>
                            <TableCell className='border border-[#444]'>{id}</TableCell>
                            <TableCell className='border border-[#444]'>{name}</TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}

export default ItemTypeTable
