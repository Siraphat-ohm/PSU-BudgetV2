'use client'
import { Button } from "@mui/material"
import { usePathname, useRouter } from "next/navigation"

export const EditButton = (  { id } : { id: string | number }) => {
    const router = useRouter()
    const pathname = usePathname()
    return (
        <Button color="primary" variant="contained" onClick={() => router.push(`${pathname}/${id}`)}>Edit</Button>
    )
}