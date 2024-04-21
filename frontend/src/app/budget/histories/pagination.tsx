'use client'
import React, { FC } from 'react';
import Pagination from '@mui/material/Pagination';
import { useSearchParams,useRouter, usePathname } from 'next/navigation';

interface PaginationProps {
    totalPages: number
}

const CustomPagination: FC<PaginationProps> = ( { totalPages } ) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname()


 const handleChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', newPage.toString()); // Ensure page is a string
    router.push( `${pathname}?${newSearchParams}` );
  };

  return (
    <Pagination
      count={totalPages}
      page={parseInt(searchParams.get('page') || '1')}
      onChange={handleChange}
      className='center mt-3'
    />
  );
};

export default CustomPagination;