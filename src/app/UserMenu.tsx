import { Avatar, Box, Icon, IconButton, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { useAuthContext } from './authContext';
import { signOutEndpoint } from './backend';

export function UserMenu() {
  const { user, onSignOut } = useAuthContext();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  function signOut() {
    signOutEndpoint();
    onSignOut();
  }

  return (
    <div>
      <IconButton
        aria-label="User"
        aria-controls="user-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <Avatar>
          <Icon>person</Icon>
        </Avatar>
      </IconButton>
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            padding: '16px',
            borderBottom: 1,
            borderColor: 'grey.300',
            marginBottom: '8px',
          }}
        >
          <Avatar>
            <Icon>person</Icon>
          </Avatar>
          <Box textAlign="center">
            <div>{user.name}</div>
            <small>{user.email}</small>
          </Box>
        </Box>
        <MenuItem onClick={signOut}>Logout</MenuItem>
      </Menu>
    </div>
  );
}
