import React, { useState, useEffect } from 'react';
import MessageIcon from '@mui/icons-material/Message';
import { AppBar, Toolbar, Typography, Box, IconButton, InputLabel, Button, ListItemButton, ListItemIcon } from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { CldImage } from 'next-cloudinary';
import Badge from '@mui/material/Badge';


const Navbar = () => {
  const router = useRouter();
  const { isLoggedIn, logout } = useAuth();
  const [image, setImage] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [user_ID, setUser_ID] = useState("");
  const [post_ID, setPost_ID] = useState("");
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  useEffect(() => {
    if(isLoggedIn) {
      const token = localStorage.getItem('token');
      const decodedToken = jwt_decode(token);
      const user_id = decodedToken.user_id; 
      const id_post = decodedToken.id_post;
      setUser_ID(decodedToken.user_id);
      setPost_ID(decodedToken.id_post);

      // Fetch user data
      axios.get(`http://localhost:7000/users/${user_id}`).then((res) => {
        setImage(res.data.image);
        setFullName(res.data.nom+" "+res.data.prenom);
        setRole(res.data.id_post);
      });
    }
  }, [isLoggedIn]);


  useEffect(() => {
      if (user_ID && post_ID) {
        fetchUnreadMessages();
      }
    }, [user_ID, post_ID]);


    async function fetchUnreadMessages() {
      try {
        const response = await axios.get('http://localhost:7000/messages');
        
        if (response.status === 200) {
          const groupMessages = response.data.filter(
            message => message.ID_SentTo === 'Group' && message.ID_PostSent === post_ID && message.View === false && message.ID_Sent != user_ID
          );
    
          const userMessages = response.data.filter(
            message => message.ID_SentTo === user_ID && message.ID_PostSent === post_ID && message.View === false && message.ID_Sent != user_ID
          );
    
          const totalUnread = groupMessages.length + userMessages.length;
    
          setUnreadMessagesCount(totalUnread);
        }
      } catch (error) {
        console.error('Error fetching unread messages', error);
      }
    }

    const handleSendMessageClick = () => {
      router.push('/SendMessages/sendMessage');
    };
  
    useEffect(() => {
      if (user_ID && post_ID) {
        // Fetch messages immediately
        fetchUnreadMessages();
    
        // Then fetch every 5 seconds
        const intervalId = setInterval(fetchUnreadMessages, 1000);
    
        // Clear interval on component unmount or if user_ID and post_ID change
        return () => clearInterval(intervalId);
      }
    }, [user_ID, post_ID]);    


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

  const handleProfileClick = () => {
    router.push(`/Tables/Users/pofileID`);
  };

  return (
    <>
    <AppBar position="static" sx={{backgroundImage: "url('/background.jpg')"}}>
        <Toolbar sx={{ justifyContent: 'space-between', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, animation: 'fadeIn 0.5s forwards', '@keyframes fadeIn': { from: { opacity: 0 }, to: { opacity: 1 }, }, }}>
            <span style={{ fontWeight: 700, fontSize: '24px' }}>Harbor <span style={{ color: '#f5e4c3' }}>Hotel</span></span>
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>

        {isLoggedIn ? (
          <>
            <InputLabel sx={{color: 'white'}}>{role.Name}</InputLabel>
            <ListItemButton onClick={handleSendMessageClick}>
              <ListItemIcon sx={{ color: 'white' }}>
                <Badge badgeContent={unreadMessagesCount} color="error" invisible={unreadMessagesCount === 0}>
                  <MessageIcon />
                </Badge>
              </ListItemIcon>
              </ListItemButton>
              <div className="image-preview">
                <CldImage width="50" height="50" src={`/Users/${image}`} alt={image} style={{ borderRadius: '50%', objectFit: 'cover' }}/>
              </div>
                <Button variant="text" color="inherit" onClick={handleProfileClick} sx={{ marginLeft: 2, textTransform: 'none' }}>{fullName}</Button>
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