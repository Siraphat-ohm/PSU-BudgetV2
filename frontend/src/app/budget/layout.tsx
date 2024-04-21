import { getServerSession } from "next-auth";
import React, { ReactNode } from 'react'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import HistoryIcon from '@mui/icons-material/History';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import ClientSidebar from "@/components/Sidebars/ClientSidebar";

const ROUTES = [
    {
        name: "เบิกจ่าย", link: "/budget/disbursement", icon: <AttachMoneyIcon sx={{ mr: 2 }} />
    },
    {
        name: "ประวัติการเบิกจ่าย", link: "/budget/histories", icon: <HistoryIcon sx={{ mr: 2 }} />
    },
    {
        name: "รายงานการเบิกจ่าย", link: "/budget/summary", icon: <LocalPrintshopIcon sx={{ mr: 2 }} />
    }
];

type Props = {
    children: ReactNode
}

const layout = async ( { children }: Props ) => {
    const session = await getServerSession(authOptions);

    return (
        <ClientSidebar user={session?.user} routes={ROUTES} header="PSU-Budget">
            {children}
        </ClientSidebar>
    )
}

export default layout
