'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import { Collapse, ListItemText } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import HomeIcon from '@mui/icons-material/Home';
import { useRouter } from 'next/navigation';
import { User } from '@/interfaces/user';
import UserProfile from './UserProfile';

const drawerWidth = 240;

interface subRoutes {
    label: string
    link: string
    icon: React.JSX.Element
}

interface Routes {
    name: string;
    icon: React.JSX.Element
    subRoutes?: subRoutes[]
    link?: string
}

type Props = {
    children: React.ReactNode,
    user?: User,
    routes: Routes[],
    header: string
}


const AdminSidebar = ({ children, user, routes, header }: Props) => {
    const [openRoutes, setOpenRoutes] = React.useState<number[]>([]);

    const router = useRouter();

    const handleClickRoute = (index: number) => {
        if (openRoutes.includes(index)) {
            setOpenRoutes(openRoutes.filter((item) => item !== index));
        } else {
            setOpenRoutes([...openRoutes, index]);
        }
    };

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
                <List>
                    <ListItemButton onClick={() => router.push('/dashboard')}>
                        <HomeIcon sx={{ mr: 2 }} />
                        <ListItemText primary="Home" />
                    </ListItemButton>
                </List>
                <Divider />
                <List>
                    {routes.map(({ name, icon, subRoutes }, index) => (
                        <Box key={index}>
                            <ListItemButton onClick={() => handleClickRoute(index)}>
                                {icon}
                                <ListItemText primary={name} />
                                {subRoutes && (openRoutes.includes(index) ? <ExpandLess /> : <ExpandMore />)}
                            </ListItemButton>
                            {subRoutes && <Collapse in={openRoutes.includes(index)} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {subRoutes.map(({ icon, label, link }, subIndex) => (
                                        <ListItemButton key={subIndex} sx={{ pl: 4 }} onClick={() => router.push(link)}>
                                            {icon}
                                            <ListItemText primary={label} />
                                        </ListItemButton>
                                    ))}
                                </List>
                            </Collapse>}
                        </Box>
                    ))}
                </List>
                <Divider />
                <Box sx={{ flexGrow: 1 }} />
                <UserProfile user={user} />
            </Drawer>
            <Box
                component="main"
                sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
            >
                <Box className="flex flex-col gap-6 border-solid border-2 border-[#333] rounded-md p-6">
                    {children}
                </Box>
            </Box>
        </Box>
    );
}

export default AdminSidebar;