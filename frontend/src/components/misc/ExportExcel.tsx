'use client';
import { ReportedMode } from '@/lib/mappings'
import { convertToBE } from '@/lib/misc'
import { Box, IconButton, Typography } from '@mui/material'
import { useSearchParams } from 'next/navigation'
import React from 'react'
import DownloadIcon from '@mui/icons-material/Download';
import * as xlsx from 'xlsx-js-style';
import { ItemcodeReport, OverviewReport } from '@/schema/Report';

type Props = {
  data: ItemcodeReport[] | OverviewReport[]
}

const createHeaderTable = (headerTable: string[]) => {
  return headerTable.map(cell => {
    return {
      t: 's',
      v: cell,
      s: {
        alignment: {
          horizontal: 'center'
        },
        fill: {
          patternType: 'solid',
          fgColor: { rgb: 'FFD700' }
        },
        border: {
          top: { style: 'thin', color: { auto: 1 } },
          bottom: { style: 'thin', color: { auto: 1 } },
          left: { style: 'thin', color: { auto: 1 } },
          right: { style: 'thin', color: { auto: 1 } },
        }
      }
    }
  })
}

const bodyCellStyle = (cell: string | number) => {
  return {
    t: typeof cell === 'number' ? 'n' : 's',
    v: cell,
    s: {
      alignment: {
        horizontal: 'center'
      },
      fill: {
        patternType: 'solid',
        fgColor: { rgb: 'D3D3D3' },
      },
      border: {
        top: { style: 'thin', color: { auto: 1 } },
        bottom: { style: 'thin', color: { auto: 1 } },
        left: { style: 'thin', color: { auto: 1 } },
        right: { style: 'thin', color: { auto: 1 } },
      },
      numFmt: typeof cell === 'number' ? '#,##0.00' : undefined,
    },

  }
}

const generateReportRows = (data: ItemcodeReport[] | OverviewReport[], mode: ReportedMode) => {
  if (mode === 'N') {
    return ( data as ItemcodeReport[] ) .flatMap(({ product, totalAmount, faculty, plan, disItems, name, code, type }) => {
      let balance = Number(totalAmount);
      let sumWithdrawalAmount = 0;

      return [
        [faculty],
        ['แผน', plan],
        ['ผลผลิต/โครงการ', product],
        ['ประเภท', type],
        ['Itemcode', code],
        ['ชื่อรายการ', name],
        ['จำนวนเงินที่ได้รับ', totalAmount],
        createHeaderTable(['วันที่เบิกจ่าย', 'เลขที่ ม.อ.', 'จำนวนเงินที่เบิกจ่าย', 'คงเหลือ', 'หมายเหตุ']),
        ...disItems.map(({ date, note, psuCode, withdrawalAmount }) => {
          const numWithdrawalAmount = Number(withdrawalAmount);
          balance -= withdrawalAmount;
          sumWithdrawalAmount += numWithdrawalAmount;

          return [
            convertToBE(date),
            psuCode,
            numWithdrawalAmount,
            balance,
            note,
          ];
        }).map(row => row.map(cell => bodyCellStyle(cell))),
        ['รวม', '', sumWithdrawalAmount, balance, ''].map(cell => bodyCellStyle(cell)),
        [''],
      ];
    });
  } else {
    return [
      createHeaderTable(['Itemcode', 'ชื่อรายการ', 'คณะ', 'แผน', 'ผลผลิต/โครงการ', 'ประเภท', 'จำนวนเงินที่ได้รับ', 'คงเหลือ']),
      ...data.flatMap(({ product, totalAmount, faculty, plan, name, code, balance, type }) => {
        return [
          [code, name, faculty, plan, product, type, totalAmount, balance].flatMap(cell => bodyCellStyle(cell)),
        ];
      })
    ]
  }
};

const generateExcel = (data: ItemcodeReport[] | OverviewReport[], { mode, startDate, endDate } : { 
  mode: ReportedMode, 
  startDate: string, 
  endDate: string
}) => {
  let title = mode === 'N' ? 'เงินประจำปี' : 'ภาพรวม';

  let filename : string;
  const startDateBE = convertToBE( startDate )
  const endDateBE = convertToBE( endDate )
  if ( startDate || endDate ) {
    if ( startDate && !endDate )
      title = `รายงาน${title} ตั้งแต่ วันที่ ${startDateBE}`;
    else if ( !startDate && endDate )
      title = `รายงาน${title} ถึง วันที่ ${endDateBE}`;
    else
      title = `รายงาน${title} ระหว่างวันที่ ${startDateBE} ถึง ${endDateBE}`;
  } else {
    title = `รายงาน${title}`;
  }

  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.aoa_to_sheet([
    [title],
    [''],
  ]);

  const rows = generateReportRows(data, mode);
  ws['!cols'] = [
    { wpx: 100 },
    { wpx: 200 },
    { wpx: 100 },
    { wpx: 100 },
    { wpx: 200 },
    { wpx: 100 },
    { wpx: 100 },
    { wpx: 100 },
  ];

  ws['!rows'] = [{ hpx: 30 }, ...Array.from({ length: 10 }, () => ({ hpx: 20 })), { hpx: 30 }];

  xlsx.utils.sheet_add_aoa(ws, rows, { origin: -1 });

  xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
  xlsx.writeFile(wb, `${title}.xlsx`);
};


const ExportExcel = ({ data }: Props) => {
  const params = useSearchParams();
  const mode = params.get('mode') as ReportedMode;
  const startDate = params.get('startDate');
  const endDate = params.get('endDate');
  return (
    <Box>
      <IconButton
        className='flex gap-1'
        onClick={() => generateExcel(data, {
          mode: mode as ReportedMode,
          startDate: startDate as string,
          endDate: endDate as string
        })}
      >
        <Typography >
          Export Excel
        </Typography>
        <DownloadIcon />
      </IconButton>
    </Box>
  )
}

export default ExportExcel;