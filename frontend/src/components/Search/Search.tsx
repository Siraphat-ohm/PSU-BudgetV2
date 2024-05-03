"use client"
import { TextField } from '@mui/material'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
// Seacch component using text field MUI that can query string to backend

import React from 'react'

type Props = {
    placeholder: string
}

const Search = ( { placeholder } : Props ) => {
    const { replace } = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const handleSearch = ( term: string ) => {
        const params = new URLSearchParams(searchParams);
        if ( term ) {
           params.set('psuCode', term); 
        } else {
            params.delete('psuCode');
        }
        replace( `${pathname}?${params.toString()}` );
    }

    return (
        <TextField 
            onChange={ (e) => handleSearch(e.target.value) }
            defaultValue={searchParams.get('psuCode') || ''}
            placeholder={placeholder}
            size='small'
            fullWidth
        />
  )
}

export default Search
