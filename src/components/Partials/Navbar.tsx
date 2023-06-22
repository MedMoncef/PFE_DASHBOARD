import React, { useState } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { AppBar, Toolbar, Typography, Box, IconButton, Avatar, Button, Menu, MenuItem, CardContent, Card } from '@mui/material';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 500 },
  { name: 'Apr', value: 200 },
  { name: 'May', value: 600 },
];

const Navbar = () => {
const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
    <AppBar position="static" sx={{backgroundImage: "url('/background.jpg')"}}>
        <Toolbar sx={{ justifyContent: 'space-between', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
        <Typography
            variant="h6"
            component="div"
            sx={{
            flexGrow: 1,
            animation: 'fadeIn 0.5s forwards',
            '@keyframes fadeIn': {
                from: { opacity: 0 },
                to: { opacity: 1 },
            },
            }}
        >
            <span style={{ fontWeight: 700, fontSize: '24px' }}>
            Harbor <span style={{ color: '#f5e4c3' }}>Hotel</span>
            </span>
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" onClick={handleClick}>
            <NotificationsIcon />
            </IconButton>
            <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            >
            <MenuItem onClick={handleClose}>Notification 1</MenuItem>
            <MenuItem onClick={handleClose}>Notification 2</MenuItem>
            <MenuItem onClick={handleClose}>Notification 3</MenuItem>
            </Menu>
            <Avatar sx={{ marginLeft: 2 }}>A</Avatar>
            <Button
            variant="text"
            color="inherit"
            sx={{ marginLeft: 2, textTransform: 'none' }}
            >
            Logout
            </Button>
        </Box>
        </Toolbar>
    </AppBar>
  </>
  );
};

export default Navbar;