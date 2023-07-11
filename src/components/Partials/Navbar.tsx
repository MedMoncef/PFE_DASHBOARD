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
import Badge from '@mui/material/Badge';


const Navbar = () => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const { isLoggedIn, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [image, setImage] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [messages, setMessages] = useState([]);
  const [userPic, setUserPic] = useState([]);
  const [messageCount, setMessageCount] = useState(0);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [readMessageIDs, setReadMessageIDs] = useState([]);

  useEffect(() => {
    if(isLoggedIn) {
      const token = localStorage.getItem('token');
      const decodedToken = jwt_decode(token);
      const user_id = decodedToken.user_id; 
      const id_post = decodedToken.id_post;

      // Fetch user data
      axios.get(`http://localhost:7000/users/${user_id}`).then((res) => {
        setImage(res.data.image);
        setFullName(res.data.nom+" "+res.data.prenom);
        setRole(res.data.id_post);
      });

        // Fetch messages related to the user
        axios.get(`http://localhost:7000/messagesNotifications/${user_id}/${id_post}`).then((res) => {
          // Filter messages to only include those with View: false
          const unreadMessages = res.data.filter(message => message.View === false);

          setMessages(unreadMessages);
          setUnreadMessageCount(unreadMessages.length);
        
        // Fetch the senders' images for each message
        res.data.forEach(message => {
          axios.get(`http://localhost:7000/users/${message.ID_Sent}`).then((response) => {
            // This will set a new property 'senderImage' on the message object
            message.senderImage = response.data.image;
          });
        });
      });
    }

    console.log(messages);
  }, [isLoggedIn]);

  const handleReadMessage = (id) => {
    setReadMessageIDs([...readMessageIDs, id]);
  };
  

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

  const handleProfileClick = () => {
    router.push(`/Tables/Users/pofileID`);
  };

  const handleNotificationClick = (messageId) => {
    // Send a PUT or PATCH request to your server to mark the message as viewed
    axios.put(`http://localhost:7000/messages/${messageId}`, { View: true })
      .then(res => {
        console.log(res.data);
  
        // Remove the message from the state
        const newMessages = messages.filter(message => message._id !== messageId);
        setMessages(newMessages);
        setUnreadMessageCount(newMessages.length);
  
        router.push('/SendMessages/sendMessage');
      })
      .catch(err => console.log(err));
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
              <IconButton color="inherit" onClick={handleClick}>
                <Badge badgeContent={messages.filter(message => !readMessageIDs.includes(message._id)).length} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                {messages.filter(message => !readMessageIDs.includes(message._id)).map((message, index) => (
                  <MenuItem onClick={() => handleNotificationClick(message._id)} key={index}>
                    <CldImage width="50" height="50" src={`/Users/${message.senderImage}`} alt="Message User Picture" style={{ borderRadius: '50%', objectFit: 'cover' }}/> : {message.Message}
                  </MenuItem>
                ))}
              </Menu>
            
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