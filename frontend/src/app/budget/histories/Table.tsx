import { DeleteButton } from '@/components/Buttons/DeletButton';
import { EditButton } from '@/components/Buttons/EditButton';
import TableCellWithBorder from '@/components/misc/TableCell';
import ApiAuth from '@/hook/ApiAuth';
import { convertToBE, displayNumber } from '@/lib/misc';
import { Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

type Props = { 
    startDate: string;
    endDate: string;
    currentPage: number ;
    seachTerm?: string;
}

const fetchHistories = async(  params: Props ): Promise<any[]> => {
    try {
        const { startDate, endDate, currentPage, seachTerm } = params
        const res = await ApiAuth.get( `/disItems/histories?page=${currentPage}&startDate=${startDate}&endDate=${endDate}&psuCode=${seachTerm}` )
        return res.data.data
    } catch (error) {
        throw error;
    }
}

const HEADERS = [ "Id", "Itemcode", "เลขที่ ม.อ.", "จำนวนเงินที่เบิกจ่าย", "วันที่เบิกจ่าย", "หมายเหตุ", "Actions" ]

const TableHistories = async( props : Props ) => {
    const histories = await fetchHistories( props );
    return (
            <Table sx={{ mt: 3 }}>
                <TableHead>
                    <TableRow>
                        {HEADERS.map((header, index) => {
                            return (
                                <TableCellWithBorder key={index}>{header}</TableCellWithBorder>
                            )
                        })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {histories.length > 0 && (histories).map((item, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCellWithBorder>{item.id}</TableCellWithBorder>
                                <TableCellWithBorder>{item.code}</TableCellWithBorder>
                                <TableCellWithBorder>{item.psuCode}</TableCellWithBorder>
                                <TableCellWithBorder>{displayNumber( Number( item.withdrawalAmount ))}</TableCellWithBorder>
                                <TableCellWithBorder>{convertToBE( item.date )}</TableCellWithBorder>
                                <TableCellWithBorder>{item.note ?? "-"}</TableCellWithBorder>
                                <TableCell width="10%">
                                    <Box className="flex justify-center items-center gap-1">
                                        <EditButton id={item.id} />
                                        <DeleteButton item={item} path='disitems'/>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
    )
}

export default TableHistories;