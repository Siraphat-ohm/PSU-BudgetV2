import ExportExcel from '@/components/misc/ExportExcel';
import TableCellWithBorder from '@/components/misc/TableCell';
import { ReportedMode, ReportedStatus } from '@/lib/mappings';
import { displayNumber } from '@/lib/misc';
import { getOverviewReportedData } from '@/lib/utils';
import { Box, Table, TableBody, TableHead, TableRow, Typography } from '@mui/material';
import React from 'react'

type Props = {
  startDate: string;
  endDate: string;
  mode: ReportedMode;
  status: ReportedStatus | undefined;
  facultyId: number | undefined;
}

const HEADERS = ['itemcode', 'ชื่อรายการ', 'คณะ', 'แผน', 'ผลผลิต/โครงการ', 'ประเภท', 'จำนวนเงินที่ได้รับ', 'ยอดเงินคงเหลือ', 'ประเภทเงิน']

const OverviewTable = async (props: Props) => {
  const data = await getOverviewReportedData(props);
  return (
    <Box className="mt-3 ">
      {data && data.length > 0 && (
        <>
          <ExportExcel data={data} />
          <Typography variant='h3' className='text-center'> รายงานภาพรวม</Typography>
          <Table className='mt-3'>
            <TableHead>
              <TableRow>
                {HEADERS.map((header, index) => (
                  <TableCellWithBorder key={index} className='text-center'>{header}</TableCellWithBorder>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data && data.length > 0 && data.map((row, index) => {
                return (
                  <TableRow key={index}>
                    <TableCellWithBorder className='text-center'>{row.code}</TableCellWithBorder>
                    <TableCellWithBorder className='text-center'>{row.name}</TableCellWithBorder>
                    <TableCellWithBorder className='text-center'>{row.faculty}</TableCellWithBorder>
                    <TableCellWithBorder className='text-center'>{row.plan}</TableCellWithBorder>
                    <TableCellWithBorder className='text-center'>{row.product}</TableCellWithBorder>
                    <TableCellWithBorder className='text-center'>{row.type}</TableCellWithBorder>
                    <TableCellWithBorder className='text-center'>{displayNumber(Number(row.totalAmount))}</TableCellWithBorder>
                    <TableCellWithBorder className='text-center'>{displayNumber(Number(row.balance))}</TableCellWithBorder>
                    <TableCellWithBorder className='text-center'>{row.status === "N" ? "เงินประจำปี" : "เงินกัน"}</TableCellWithBorder>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </>
      )}
    </Box>
  )
}

export default OverviewTable
