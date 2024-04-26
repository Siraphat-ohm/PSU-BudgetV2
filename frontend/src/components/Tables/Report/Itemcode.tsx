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
    status: ReportedStatus;
    facultyId: number | undefined;
}

const HEADERS = ["วันที่เบิกจ่าย", "เลขที่ ม.อ.", "Itemcode", "ชื่อรายการ", "จำนวนเงิน", "คงเหลือ", "หมายเหตุ"]

const ItemcodeTable = async (props: Props) => {
    const data = await getItemcodeReportedData(props);
    return (
        <Box sx={{ mt: 3 }}>
            {data && data.length > 0 && data.map((row, index) => {
                let totalAmount = Number(row.totalAmount);
                const { code, name, faculty } = row;
                return (
                    <Box sx={{ mt: 3 }}>
                        <Box className="flex gap-3 mb-3">
                            <Typography variant='h6'>{faculty}</Typography>
                            <Typography variant='h6'>{code}</Typography>
                            <Typography variant='h6'>{name}</Typography>
                            <Typography variant='h6'>เงินที่ได้รับ : {displayNumber(totalAmount)} บาท</Typography>
                        </Box>
                        <Table key={index}>
                            <TableHead>
                                <TableRow>
                                    {HEADERS.map((header, index) => (
                                        <TableCellWithBorder key={index} align="center">{header}</TableCellWithBorder>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {row.disItems.map((disItem, index) => {
                                    const withdrawalAmount = Number(disItem.withdrawalAmount);
                                    totalAmount -= Number(withdrawalAmount);
                                    const displayTotalAmount = displayNumber(totalAmount)
                                    const displayWithdrawalAmount = displayNumber(withdrawalAmount)
                                    const date = convertToBE(disItem.date);
                                    return (
                                        <TableRow key={index}>
                                            <TableCellWithBorder align="center">{date}</TableCellWithBorder>
                                            <TableCellWithBorder align="center">{disItem.psuCode}</TableCellWithBorder>
                                            <TableCellWithBorder align="center">{row.code}</TableCellWithBorder>
                                            <TableCellWithBorder align="center">{row.name}</TableCellWithBorder>
                                            <TableCellWithBorder align="center">{displayWithdrawalAmount}</TableCellWithBorder>
                                            <TableCellWithBorder align="center">{displayTotalAmount}</TableCellWithBorder>
                                            <TableCellWithBorder className='w-[10%]' align="center">{disItem.note}</TableCellWithBorder>
                                        </TableRow>
                                    )
                                })}
                                <TableRow>
                                    <TableCellWithBorder align="center" colSpan={5}>คงเหลือ</TableCellWithBorder>
                                    <TableCellWithBorder align="center">{displayNumber(totalAmount)}</TableCellWithBorder>
                                    <TableCellWithBorder align="center">บาท</TableCellWithBorder>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Box>
                )
            })}
        </Box>
    )
}

export default ItemcodeTable
