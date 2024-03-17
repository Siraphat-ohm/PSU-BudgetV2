'use client';
import { useSession } from "next-auth/react";
import { Skeleton } from "@nextui-org/react";
import { User } from "@/_schema/user";
import { ReactNode } from "react";
import Header from "../components/admin/Header";
import Sidebar from "../components/admin/Sidebar";

export default function layout({ children }: { children: ReactNode} ) {
    const { status, data:session } = useSession();

    if ( status === "loading" )
        return <Skeleton/>

    return (
        <div>
            <Header user={ session?.user as User } />
            <Sidebar />
            <main className='ml-64'>
                    {children}
            </main>
        </div> 
    )
}