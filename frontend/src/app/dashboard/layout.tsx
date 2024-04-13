'use client';
import PermanentDrawerLeft from '@/components/Sidebar'
import { useSession } from 'next-auth/react'
import React, { ReactNode } from 'react'
type Props = {
    children: ReactNode
}

const layout = ({ children }: Props) => {
    const { status, data: session } = useSession();

    if (status == "loading") return <p>Loading...</p>

    return (
        <div>
            <PermanentDrawerLeft user={ session?.user }>
                {children}
            </PermanentDrawerLeft>
        </div>
    )
}

export default layout
