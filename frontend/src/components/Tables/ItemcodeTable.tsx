import { Itemcode } from '@/schema/tables/Itemcode';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

type Props = {
    itemcodes: Itemcode[];
}

const ItemcodeTable = ({ itemcodes }: Props) => {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell className="border border-[#444]">Code</TableCell>
                    <TableCell className="border border-[#444]">Name</TableCell>
                    <TableCell className="border border-[#444]">Total amount</TableCell>
                    <TableCell className="border border-[#444]">Balance</TableCell>
                    <TableCell className="border border-[#444]">Status</TableCell>
                    <TableCell className="border border-[#444]">Faculty Id</TableCell>
                    <TableCell className="border border-[#444]">Product Id</TableCell>
                    <TableCell className="border border-[#444]">Type Id</TableCell>
                    <TableCell className="border border-[#444]">Fiscal year Id</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {(itemcodes).map((item, index) => {
                    return (
                        <TableRow key={index} className={index % 2 === 0 ? "bg-[#333]" : ""}>
                            <TableCell className="border border-[#444]">{item.code}</TableCell>
                            <TableCell className="border border-[#444]">{item.name}</TableCell>
                            <TableCell className="border border-[#444]">{item.totalAmount}</TableCell>
                            <TableCell className="border border-[#444]">{item.balance}</TableCell>
                            <TableCell className="border border-[#444]">{item.status}</TableCell>
                            <TableCell className="border border-[#444]">{item.facultyId}</TableCell>
                            <TableCell className="border border-[#444]">{item.productId}</TableCell>
                            <TableCell className="border border-[#444]">{item.typeId}</TableCell>
                            <TableCell className="border border-[#444]">{item.fiscalYearId}</TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}

export default ItemcodeTable;