'use client';
import { Box } from '@mui/material';
import * as React from 'react';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

const DateRange = () => {
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
    <Box className="flex mt-3 gap-3">
      <LocalizationProvider 
        dateAdapter={AdapterDayjs} 
      >
        <DatePicker
          label="วันที่เริ่ม"
          value={null}
          onChange={(newValue: Dayjs | null) => handleDateChange('startDate', newValue)}
        />
        <DatePicker
          label="วันที่สุดท้าย"
          value={null}
          onChange={(newValue: Dayjs | null) => handleDateChange('endDate', newValue)}
        />
      </LocalizationProvider>
    </Box>
  );
};

export default DateRange;
