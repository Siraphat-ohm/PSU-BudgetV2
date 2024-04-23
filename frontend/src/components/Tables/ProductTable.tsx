import { Product } from '@/schema/tables/Product';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import React from 'react'

type Props = {
  products: Product[];
}

const ProductTable = ({ products }: Props) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell className="border border-[#444]">Id</TableCell>
          <TableCell className="border border-[#444]">Name</TableCell>
          <TableCell className="border border-[#444]">Plan Id</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {(products).map(( { id, name, planId }, index) => {
          return (
            <TableRow key={index} className={index % 2 === 0 ? "bg-[#333]" : ""}>
              <TableCell className="border border-[#444]">{id}</TableCell>
              <TableCell className="border border-[#444]">{name}</TableCell>
              <TableCell className="border border-[#444]">{planId}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default ProductTable
