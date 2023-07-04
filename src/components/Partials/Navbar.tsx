import React, { useState, useEffect } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { AppBar, Toolbar, Typography, Box, IconButton, Avatar, Button, Menu, MenuItem } from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { CldImage } from 'next-cloudinary';

const Navbar = () => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const { isLoggedIn, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [image, setImage] = useState("");

  useEffect(() => {
    if(isLoggedIn) {
      const token = localStorage.getItem('token');
      const decodedToken = jwt_decode(token);
      const user_id = decodedToken.user_id; // Replace 'sub' with the actual property name for user id in your decoded token
      axios.get(`http://localhost:7000/users/${user_id}`).then((res) => {
        setImage(res.data.image);
      });
    }
  }, [isLoggedIn]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRegisterUserClick = () => {
    router.push('/auth/register');
  };

  const handleLoginClick = () => {
    router.push('/auth/login');
  };

  const handleLogoutClick = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <>
    <AppBar position="static" sx={{backgroundImage: "url('/background.jpg')"}}>
        <Toolbar sx={{ justifyContent: 'space-between', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, animation: 'fadeIn 0.5s forwards', '@keyframes fadeIn': { from: { opacity: 0 }, to: { opacity: 1 }, }, }}>
            <span style={{ fontWeight: 700, fontSize: '24px' }}>Harbor <span style={{ color: '#f5e4c3' }}>Hotel</span></span>
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" onClick={handleClick}><NotificationsIcon /></IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem onClick={handleClose}>Notification 1</MenuItem>
              <MenuItem onClick={handleClose}>Notification 2</MenuItem>
              <MenuItem onClick={handleClose}>Notification 3</MenuItem>
            </Menu>
            {isLoggedIn ? (
              <>
              <div className="image-preview">
                <CldImage width="50" height="50" src={`/Users/${image}`} alt={image} style={{ borderRadius: '50%', objectFit: 'cover' }}/>
              </div>
                <Button variant="text" color="inherit" onClick={handleLogoutClick} sx={{ marginLeft: 2, textTransform: 'none' }} startIcon={<LogoutIcon />}>Logout</Button>
              </>
            ) : (
              <>
                <Button variant="text" color="inherit" onClick={handleLoginClick} sx={{ marginLeft: 2, textTransform: 'none' }} startIcon={<LockOutlinedIcon />}>Login</Button>
                <Button variant="text" color="inherit" onClick={handleRegisterUserClick} sx={{ marginLeft: 2, textTransform: 'none' }} startIcon={<AppRegistrationIcon />}>Register</Button>
              </>
            )}
        </Box>
        </Toolbar>
    </AppBar>

    <style>
  {`
    .image-preview {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #ccc;
    }
  `}
</style>
    </>
  );
};

export default Navbar;