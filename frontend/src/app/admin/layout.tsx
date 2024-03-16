'use client'
import { ReactNode } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { useSession } from "next-auth/react";
import { Skeleton } from "@nextui-org/react";
import { User } from "@/schema/user";

export default function layout({ children }: { children: ReactNode} ) {
    const { status, data:session } = useSession();

    if ( status === "loading" )
        return (
            <Skeleton>
            </Skeleton>
        )

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