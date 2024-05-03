import { User } from '@/interfaces/user';
import { Box, Avatar, Typography, IconButton, Menu, MenuItem } from '@mui/material'
import { signOut } from 'next-auth/react'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React from 'react'

type Props = {
    user?: User,
}

const UserProfile = ({ user }: Props) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => setAnchorEl(null);

    return (
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
                    <MenuItem onClick={() => signOut()}> ออกจากระบบ </MenuItem>
                </Menu>
            </Box>
        </Box>
    )
};

export default UserProfile;
