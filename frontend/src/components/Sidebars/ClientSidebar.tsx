'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import { ListItemText } from '@mui/material';
import { User } from '@/interfaces/user';
import UserProfile from './UserProfile';
import { useRouter } from 'next/navigation';

const drawerWidth = 240;

interface Routes {
    name: string;
    icon: React.JSX.Element
    link: string
}

type Props = {
    children: React.ReactNode,
    user?: User,
    routes: Routes[],
    header: string
}

const ClientSidebar = ({ children, user, routes, header }: Props) => {

    const router = useRouter();

    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Typography variant='h6' sx={{ p: 3 }}>{header}</Typography>
                <Divider />
                <Divider />
                <List>
                    {routes.map(({ name, icon, link }, index) => (
                        <Box key={index}>
                            <ListItemButton onClick={() => router.push( link )}>
                                {icon}
                                <ListItemText primary={name} />
                            </ListItemButton>
                        </Box>
                    ))}
                </List>
                <Divider />
                <Box sx={{ flexGrow: 1 }} />
                <UserProfile user={user}/>
            </Drawer>
            <Box
                component="main"
                sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
            >
                {children}
            </Box>
        </Box>
    );
}

export default ClientSidebar