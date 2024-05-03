'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import { Collapse, IconButton, ListItemText, Toolbar, alpha, styled } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import HomeIcon from '@mui/icons-material/Home';
import { useRouter } from 'next/navigation';
import { User } from '@/interfaces/user';
import UserProfile from './UserProfile';
import MenuIcon from '@mui/icons-material/Menu';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import theme from '@/lib/theme';
import test from 'node:test';

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

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
}>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));



const Sidebar = ({ children, user, routes, header }: Props) => {
    const [openRoutes, setOpenRoutes] = React.useState<number[]>([]);

    const [open, setOpen] = React.useState(true);

    const handleDrawerOpen = () => {
        setOpen(!open);
    }

    const handleDrawerClose = () => {
        setOpen(false);
    }

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
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ mr: 2, ...(open && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        {header}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {
                        routes.map(({ name, icon, subRoutes, link }, index) => {
                            return (
                                <Box key={index}>
                                    <ListItemButton onClick={() => {
                                        if (link) {
                                            router.push(link);
                                        } else {
                                            handleClickRoute(index);
                                        }
                                    }}>
                                        {icon}
                                        <ListItemText primary={name} />
                                        {subRoutes && (openRoutes.includes(index) ? <ExpandLess /> : <ExpandMore />)}
                                    </ListItemButton>
                                    <Collapse in={openRoutes.includes(index)} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {
                                                subRoutes?.map(({ label, link, icon }, index) => (
                                                    <ListItemButton key={index} sx={{ pl: 4 }} onClick={() => router.push(link)}>
                                                        {icon}
                                                        <ListItemText primary={label} />
                                                    </ListItemButton>
                                                ))
                                            }
                                        </List>
                                    </Collapse>
                                </Box>
                            )
                        })
                    }
                </List>
                <Divider />
                <Box sx={{ flexGrow: 1 }} />
                <UserProfile user={user} />
            </Drawer>
            <Main
                open={open}
            >
                <DrawerHeader />
                <Box
                    sx={{
                        border: `1px solid #333`,
                        borderRadius: `10px`,
                        padding: theme.spacing(3),
                    }}
                >
                    {children}
                </Box>
            </Main>
        </Box >
    );
}

export default Sidebar;