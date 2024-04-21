import ApiAuth from '@/hook/ApiAuth';
import { convertToBE } from '@/lib/utils';
import { HistoriesDisbursement } from '@/types/options';
import { Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { DeleteButton, EditButton } from './Buttons';

type Props = { 
    startDate: string;
    endDate: string;
    currentPage: number ;
}

const fetchHistories = async(  currentPage:number, startDate:string, endDate:string ): Promise<HistoriesDisbursement[]> => {
    try {
        const res = await ApiAuth.get( `/budgets/histories?page=${currentPage}&startDate=${startDate}&endDate=${endDate}` )
        return res.data.data
    } catch (error) {
        throw error;
    }
}

const TableHistories = async( { currentPage, startDate, endDate } : Props ) => {
    const histories = await fetchHistories( currentPage, startDate, endDate )
    return (
        <Box className="mt-3">
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell className="border border-[#444]">Id</TableCell>
                        <TableCell className="border border-[#444]">Itemcode</TableCell>
                        <TableCell className="border border-[#444]">เลขที่ ม.อ.</TableCell>
                        <TableCell className="border border-[#444]">จำนวนเงินที่เบิกจ่าย</TableCell>
                        <TableCell className="border border-[#444]">วันที่เบิกจ่าย</TableCell>
                        <TableCell className="border border-[#444]">หมายเหตุ</TableCell>
                        <TableCell className="border border-[#444]">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {histories.length > 0 && (histories).map((item, index) => {
                        return (
                            <TableRow key={index} className={index % 2 === 0 ? "bg-[#333]" : ""}>
                                <TableCell className="border border-[#444]">{item.id}</TableCell>
                                <TableCell className="border border-[#444]">{item.code}</TableCell>
                                <TableCell className="border border-[#444]">{item.psuCode}</TableCell>
                                <TableCell className="border border-[#444]">{item.withdrawalAmount}</TableCell>
                                <TableCell className="border border-[#444]">{convertToBE( item.date )}</TableCell>
                                <TableCell className="border border-[#444]">{item.note}</TableCell>
                                <TableCell className="border border-[#444]" width="10%">
                                    <div className="flex justify-center items-center gap-1">
                                        {/* <Button color="primary" variant="contained" onClick={() => router.push(`${pathname}/${item.id}`)}>Edit</Button>
                                        <Button color="error" variant="contained" onClick={() => handleOpenDeleteDialog(item)}>Delete</Button> */}
                                        <EditButton id={item.id} />
                                        <DeleteButton history={item}/>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </Box>
    )
}

export default TableHistories;