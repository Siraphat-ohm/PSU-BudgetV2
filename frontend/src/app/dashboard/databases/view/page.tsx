import React, { Suspense } from 'react';
import SearchAutocomplete from '@/components/Search/Autocomplete';
import { IMPORT_FORM_OPTIONS } from '@/lib/mappings';
import { Box, Typography } from '@mui/material';
import RenderTable from './Table';


const Page = (
    { searchParams }: {
        searchParams?: {
            table?: string
        };
    }
) => {
    const table = searchParams?.table || '';
    return (
        <Box className="flex flex-col">
            <Typography variant="h2">View Tables</Typography>
            <Box className="mt-3">
                <SearchAutocomplete
                    options={IMPORT_FORM_OPTIONS}
                    field='table'
                    label='Table'
                    placeholder='Select a table'
                />
            </Box>
            <Suspense fallback={<p>loading...</p>}>
                <RenderTable table={table} />
            </Suspense>
        </Box>
    )
}

export default Page