import TableCellWithBorder from '@/components/misc/TableCell';
import { ReportedMode, ReportedStatus } from '@/lib/mappings';
import { displayNumber, convertToBE } from '@/lib/misc';
import { getOverviewReportedData } from '@/lib/utils';
import { Table, TableBody, TableHead, TableRow } from '@mui/material';
import React from 'react'

type Props = {
  startDate: string;
  endDate: string;
  mode: ReportedMode;
  status: ReportedStatus;
  facultyId: number | undefined;
}

const HEADERS = [ 'itemcode', 'ชื่อรายการ', 'คณะ', 'แผน', 'ผลผลิต/โครงการ', 'ประเภท', 'จำนวนเงินที่ได้รับ', 'ยอดเงินคงเหลือ']

const OverviewTable = async (props: Props) => {
  const data = await getOverviewReportedData(props);
  return (
      <Table className='mt-3'>
        <TableHead>
          <TableRow>
            {HEADERS.map((header, index) => (
              <TableCellWithBorder key={index} align="center">{header}</TableCellWithBorder>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data && data.length > 0 && data.map((row, index) => {
            
            return (
              <TableRow key={index}>
                <TableCellWithBorder align="center">{row.code}</TableCellWithBorder>
                <TableCellWithBorder align="center">{row.name}</TableCellWithBorder>
                <TableCellWithBorder align="center">{row.faculty}</TableCellWithBorder>
                <TableCellWithBorder align="center">{row.plan}</TableCellWithBorder>
                <TableCellWithBorder align="center">{row.product}</TableCellWithBorder>
                <TableCellWithBorder align="center">{row.type}</TableCellWithBorder>
                <TableCellWithBorder align="center">{displayNumber( Number( row.totalAmount ))}</TableCellWithBorder>
                <TableCellWithBorder align="center">{displayNumber( Number( row.balance ))}</TableCellWithBorder>
              </TableRow>
          )

          })}
        </TableBody>
      </Table>
  )
}

export default OverviewTable
