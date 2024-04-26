import { Box, Typography } from '@mui/material'
import React, { Suspense } from 'react'
import ReportedTable from '@/components/Tables/ReportedTable';
import SearchAutocomplete from '@/components/Search/Autocomplete';
import DateRange from '@/components/Search/DateRange';
import { MODE_OPTIONS, ReportedMode, ReportedStatus, STATUS_OPTIONS } from '@/lib/mappings';
import { getFaucultiesByUserId } from '@/lib/utils';
import RenderTable from '@/components/Tables/ReportedTable';

const Page = async ({
  searchParams,
}: {
  searchParams?: {
    startDate?: string;
    endDate?: string;
    mode?: ReportedMode;
    status?: ReportedStatus;
    facultyId?: number;
  };
}) => {
  const startDate = searchParams?.startDate || "";
  const endDate = searchParams?.endDate || "";
  const mode = searchParams?.mode || "N";
  const status = searchParams?.status || "N";
  const faculties = [ { id: 0, name:"all" } , ...( await getFaucultiesByUserId() ) ] ;
  const facultyId = searchParams?.facultyId ;

  return (
    <Box>
      <Typography variant="h2"> รายงานการเบิกจ่าย </Typography>
      <Box className="flex gap-3 mt-3">
        <DateRange  />
        <SearchAutocomplete options={MODE_OPTIONS} field='mode' placeholder='mode' defaultValue={MODE_OPTIONS[0]}/>
        <SearchAutocomplete options={STATUS_OPTIONS} field='status' placeholder='status' defaultValue={STATUS_OPTIONS[0]}/>
        <SearchAutocomplete options={faculties} field='facultyId' placeholder='faculty'/>
      </Box>
      <Suspense fallback={<div>Loading...</div>}>
        <RenderTable startDate={startDate} endDate={endDate} mode={mode} status={status} facultyId={facultyId} />
      </Suspense>
    </Box>
  )
}

export default Page;