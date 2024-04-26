'use client';
import { Box } from '@mui/material';
import * as React from 'react';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import 'dayjs/locale/th';

const DateRange = ( ) => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleDateChange = (field: 'startDate' | 'endDate', date: Dayjs | null) => {
    const params = new URLSearchParams(searchParams);
    if (date) {
      params.set(field, date.toISOString());
    } else {
      params.delete(field);
    }

    replace(`${pathname}?${params}`);
  };

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="th"
    >
        <DatePicker
          label="วันที่เริ่ม"
          value={null}
          onChange={(newValue: Dayjs | null) => handleDateChange('startDate', newValue)}
          className='w-full'
          slotProps={{
            field: { clearable: true  },
            textField: { size: 'small'}
          }}
        />
        <p style={{ borderBottom: "1.5px solid rgb(80, 80, 78)", width: "30px", margin: "auto 10px auto 10px" }}></p>
        <DatePicker
          className='w-full'
          label="วันที่สุดท้าย"
          value={null}
          onChange={(newValue: Dayjs | null) => handleDateChange('endDate', newValue)}
          slotProps={{
            field: { clearable: true  },
            textField: { size: 'small'}
          }}
        />
    </LocalizationProvider>
  );
};

export default DateRange;
