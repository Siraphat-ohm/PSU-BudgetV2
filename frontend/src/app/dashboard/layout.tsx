import React, { ReactNode } from 'react'
import Groups2Icon from '@mui/icons-material/Groups2';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DownloadIcon from '@mui/icons-material/Download';
import StorageIcon from '@mui/icons-material/Storage';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/authOptions';
import AdminSidebar from '@/components/Sidebars/AdminSidebar';

type Props = {
    children: ReactNode
}

const ROUTES  = [
    {
        name: "Users",
        icon: <Groups2Icon sx={{ mr: 2 }}/>,
        subRoutes: [
            { label: "Table Views", link: "/dashboard/users", icon: <RemoveRedEyeIcon sx={{ mr: 2 }}/> },
            { label: "Register", link: "/dashboard/register", icon: <PersonAddIcon sx={{ mr: 2 }}/> }
        ]
    },
    {
        name: "Databases",
        icon: <StorageIcon sx={{ mr: 2 }} />,
        subRoutes: [
            { label: "Import", link: "/dashboard/databases/import", icon: <DownloadIcon sx={{ mr: 2 }}/> }
        ]
    }
];

const layout = async({ children }: Props) => {
    const session = await getServerSession(authOptions);

    return (
        <div>
            <AdminSidebar user={ session?.user } routes={ROUTES} header="PSU-Budget Admin" >
                {children}
            </AdminSidebar>
        </div>
    )
}

export default layout
