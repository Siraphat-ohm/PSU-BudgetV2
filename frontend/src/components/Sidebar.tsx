import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { User } from '@/schemas/user';
import { Avatar, Collapse, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { signOut } from 'next-auth/react';
import Groups2Icon from '@mui/icons-material/Groups2';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DownloadIcon from '@mui/icons-material/Download';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StorageIcon from '@mui/icons-material/Storage';
import HomeIcon from '@mui/icons-material/Home';
import { useRouter } from 'next/navigation';

const drawerWidth = 240;

type Props = {
    children: React.ReactNode,
    user?: User
}

const ROUTES = [
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


export default function PermanentDrawerLeft({ children, user }: Props) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [openRoutes, setOpenRoutes] = React.useState<number[]>([]);

    const router = useRouter();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClickRoute = (index: number) => {
        if (openRoutes.includes(index)) {
            setOpenRoutes(openRoutes.filter((item) => item !== index));
        } else {
            setOpenRoutes([...openRoutes, index]);
        }
    };

    const handleClose = () => setAnchorEl(null);

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
                <Typography variant='h6' sx={{ p: 3 }}>PSU-Budget Admin</Typography>
                <Divider/>
                <List>
                            <ListItemButton onClick={ () => router.push( '/dashboard')}>
                                <HomeIcon sx={{ mr: 2 }}/>
                                <ListItemText primary="Home" />
                            </ListItemButton>
                </List>
                <Divider />
                <List>
                    {ROUTES.map(({ name, icon, subRoutes }, index) => (
                        <Box key={index}>
                            <ListItemButton onClick={() => handleClickRoute(index)}>
                                {icon}
                                <ListItemText primary={name} />
                                {openRoutes.includes(index) ? <ExpandLess/> : <ExpandMore/>}
                            </ListItemButton>
                            <Collapse in={openRoutes.includes(index)} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {subRoutes.map(( { icon, label, link }, subIndex) => (
                                        <ListItemButton key={subIndex} sx={{ pl: 4 }} onClick={ () => router.push( link )}>
                                            { icon }
                                            <ListItemText primary={label} />
                                        </ListItemButton>
                                    ))}
                                </List>
                            </Collapse>
                        </Box>
                    ))}
                </List>
                <Divider />
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{
                    p: 3,
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    <Avatar>{`${user?.firstName.charAt(0)}${user?.lastName.charAt(0)}`}</Avatar>
                    <Typography variant="subtitle1" sx={{ ml: 1 }}>{`${user?.firstName} ${user?.lastName}`}</Typography>
                    <Box>
                        <IconButton
                            aria-label="more"
                            id="long-button"
                            onClick={handleClick}
                        >
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            <MenuItem onClick={() => signOut()}>Logout</MenuItem>
                        </Menu>
                    </Box>
                </Box>
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
