'use client' 

import { Box, Button, Typography } from '@mui/material'
import { signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'

type Props = {
    error: Error & { digest?: string }
    reset: () => void
}

export default function Error({ error, reset, }: Props) {
    const [ errorDigest, setErrorDigest ] = useState<string | undefined>(error.digest)
    useEffect(() => {
        if (/ECONNREFUSED.*5005/i.test(error.message))
            setErrorDigest('Could not connect the API. It may be down.')
        
    }, [error])
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 gap-3"> 
            <Typography variant="h1" className="text-3xl font-bold mb-2">Oops! Something Went Wrong</Typography>  
            <Typography variant="h2" className="text-xl mb-5">{errorDigest || error.message}</Typography>

            <Button variant='contained' color='info' onClick={reset} className="mb-3">Retry</Button>
            {
                errorDigest && <Button variant='contained' color='error' onClick={() => signOut()}>Sign Out</Button>
            }
        </div>
    )
}