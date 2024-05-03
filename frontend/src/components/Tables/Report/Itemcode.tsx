import ExportExcel from '@/components/misc/ExportExcel'
import TableCellWithBorder from '@/components/misc/TableCell'
import { ReportedMode, ReportedStatus } from '@/lib/mappings'
import { convertToBE, displayNumber } from '@/lib/misc'
import { getItemcodeReportedData } from '@/lib/utils'
import { Box, Table, TableBody, TableHead, TableRow, Typography } from '@mui/material'
import React from 'react'

type Props = {
    startDate: string;
    endDate: string;
    mode: ReportedMode;
    status: ReportedStatus | undefined;
    facultyId: number | undefined;
}

const HEADERS = ["วันที่เบิกจ่าย", "เลขที่ ม.อ.", "จำนวนเงิน", "คงเหลือ", "หมายเหตุ"]

const ItemcodeTable = async (props: Props) => {
    const data = await getItemcodeReportedData(props);
    return (
        <Box sx={{
        }}>
            {data && data.length > 0 &&
                <>
                    <ExportExcel data={data} />
                    <Typography variant='h3' className='text-center'> รายงานสรุป</Typography>
                    {data.map((row, index) => {
                        const { code, name, faculty, plan, product, type, totalAmount } = row;
                        let balance = Number(totalAmount);
                        let sumWithdrawalAmount = 0;
                        return (
                            <Box sx={{ mt: 3 }}>
                                <Box className="gap-3 mb-3 text-center">
                                    <Typography variant='h5'>{faculty}</Typography>
                                    <Typography variant='subtitle1'>แผน : {plan}</Typography>
                                    <Typography variant='subtitle1'>ผลผลิต/โครงการ : {product}</Typography>
                                    <Typography variant='subtitle1'>ประเภท : {type}</Typography>
                                    <Typography variant='subtitle1'>Itemcode : {code}</Typography>
                                    <Typography variant='subtitle1'>ชื่อรายการ : {name}</Typography>
                                    <Typography variant='subtitle1'>เงินที่ได้รับ : {displayNumber(balance)} บาท</Typography>
                                </Box>
                                <Table key={index}>
                                    <TableHead>
                                        <TableRow>
                                            {HEADERS.map((header, index) => (
                                                <TableCellWithBorder key={index} className='text-center'>{header}</TableCellWithBorder>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {row.disItems.map((disItem, index) => {
                                            const withdrawalAmount = Number(disItem.withdrawalAmount);
                                            balance -= Number(withdrawalAmount);
                                            const displayTotalAmount = displayNumber(balance)
                                            const displayWithdrawalAmount = displayNumber(withdrawalAmount)
                                            const date = convertToBE(disItem.date);
                                            sumWithdrawalAmount += withdrawalAmount;
                                            return (
                                                <TableRow key={index}>
                                                    <TableCellWithBorder className="text-center">{date}</TableCellWithBorder>
                                                    <TableCellWithBorder className="text-center">{disItem.psuCode}</TableCellWithBorder>
                                                    <TableCellWithBorder className="text-right">{displayWithdrawalAmount}</TableCellWithBorder>
                                                    <TableCellWithBorder className="text-right">{displayTotalAmount}</TableCellWithBorder>
                                                    <TableCellWithBorder className="w-[20%]">{disItem.note}</TableCellWithBorder>
                                                </TableRow>
                                            )
                                        })}
                                        <TableRow>
                                            <TableCellWithBorder className="text-left" colSpan={2}>รวม</TableCellWithBorder>
                                            <TableCellWithBorder className="text-right">{displayNumber(sumWithdrawalAmount)}</TableCellWithBorder>
                                            <TableCellWithBorder className="text-right">{displayNumber(balance)}</TableCellWithBorder>
                                            <TableCellWithBorder className="text-right">บาท</TableCellWithBorder>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Box>
                        )
                    })}
                </>}
        </Box>
    )
}

export default ItemcodeTable
