import React, { useState, useEffect } from 'react';
import { Box, List, ListItemText, ListItemIcon, ListItemButton, Fade, ListItem, Badge, Notifications } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PieChartIcon from '@mui/icons-material/PieChart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import BookIcon from '@mui/icons-material/Book';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import FoodBankIcon from '@mui/icons-material/FoodBank';
import WorkIcon from '@mui/icons-material/Work';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import PreviewIcon from '@mui/icons-material/Preview';
import KingBedIcon from '@mui/icons-material/KingBed';
import ImageIcon from '@mui/icons-material/Image';
import MarkUnreadChatAltIcon from '@mui/icons-material/MarkUnreadChatAlt';
import PersonIcon from '@mui/icons-material/Person';
import NightShelterIcon from '@mui/icons-material/NightShelter';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import jwt_decode from 'jwt-decode';
import MessageIcon from '@mui/icons-material/Message';
import axios from 'axios';


const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [user_ID, setUser_ID] = useState("");
  const [post_ID, setPost_ID] = useState("");
  const router = useRouter();
  const { isLoggedIn } = useAuth();


  useEffect(() => {
    if (isLoggedIn) {
      const token = localStorage.getItem('token');
      const decodedToken = jwt_decode(token);
      setUser_ID(decodedToken.user_id);
      setPost_ID(decodedToken.id_post);
    }
  }, [isLoggedIn]);


  const handleClick = () => {
    setOpen(!open);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleHomePageClick = () => {
    router.push('/');
  };

  const handleBlogClick = () => {
    router.push('/Tables/Blogs/blog');
  };

  const handleContactClick = () => {
    router.push('/Tables/Contacts/contact');
  };

  const handleMenuClick = () => {
    router.push('/Tables/Menus/menu');
  };

  const handleMenuTypeClick = () => {
    router.push('/Tables/MenuTypes/menuType');
  };

  const handleWorkPostClick = () => {
    router.push('/Tables/WorkPosts/workPost');
  };

  const handleReservationClick = () => {
    router.push('/Tables/Reservations/reservation');
  };

  const handleReviewClick = () => {
    router.push('/Tables/TimeTables/timeTable');
  };

  const handleRoomClick = () => {
    router.push('/Tables/Rooms/room');
  };

  const handleRoomTypeClick = () => {
    router.push('/Tables/RoomTypes/roomType');
  };

  const handleSliderClick = () => {
    router.push('/Tables/Sliders/slider');
  };

  const handleTestimonyClick = () => {
    router.push('/Tables/Testimonies/testimony');
  };

  const handleUserClick = () => {
    router.push('/Tables/Users/user');
  };

  const handleUserProfileClick = () => {
    router.push(`/Tables/Users/pofileID`);
  };

  return (
    <Box
      sx={{
        width: isOpen ? 320 : 75,
        height: 'auto',
        backgroundImage: "url('/background.jpg')",
        backgroundSize: 'cover',
        transition: 'width 0.3s',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}
      />
      <Box sx={{ p: 3, position: 'relative', zIndex: 1 }}>
      {isLoggedIn ? (
          <>
        <MenuIcon onClick={toggleSidebar} />
            {isOpen && (
              <>
                <Fade in={isOpen} timeout={500}>
                  <List sx={{ position: 'relative', zIndex: 1 }}>
                    <ListItem>
                      <ListItemButton onClick={handleHomePageClick}>
                        <ListItemIcon sx={{ color: 'white' }}>
                          <PieChartIcon />
                        </ListItemIcon>
                        <ListItemText primary="Home Page" />
                      </ListItemButton>
                    </ListItem>

                    <ListItem>
                      <ListItemButton onClick={handleClick}>
                        <ListItemIcon sx={{ color: 'white' }}>
                          <FormatListBulletedIcon />
                        </ListItemIcon>
                        <ListItemText primary="Table List" />
                        {open ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                    </ListItem>

                    <Collapse in={open} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {post_ID === "648b6a60da83ae0520b76ec3" && (
                          <>
                            <ListItem>
                              <ListItemButton sx={{ pl: 4 }} onClick={handleMenuClick}>
                                <ListItemIcon sx={{ color: 'white' }}>
                                  <RestaurantMenuIcon />
                                </ListItemIcon>
                                <ListItemText primary="Menus" />
                              </ListItemButton>
                            </ListItem>

                            <ListItem>
                              <ListItemButton sx={{ pl: 4 }} onClick={handleMenuTypeClick}>
                                <ListItemIcon sx={{ color: 'white' }}>
                                  <FoodBankIcon />
                                </ListItemIcon>
                                <ListItemText primary="Menu Types" />
                              </ListItemButton>
                            </ListItem>
                          </>
                        )}

                        {post_ID === "64ada81f04bf47db3a44b9eb" && (
                          <>
                            <ListItem>
                              <ListItemButton sx={{ pl: 4 }} onClick={handleContactClick}>
                                <ListItemIcon sx={{ color: 'white' }}>
                                  <ContactPhoneIcon />
                                </ListItemIcon>
                                <ListItemText primary="Contacts Clients" />
                              </ListItemButton>
                            </ListItem>

                            <ListItem>
                              <ListItemButton sx={{ pl: 4 }} onClick={handleReservationClick}>
                                <ListItemIcon sx={{ color: 'white' }}>
                                  <BookmarksIcon />
                                </ListItemIcon>
                                <ListItemText primary="Reservations" />
                              </ListItemButton>
                            </ListItem>
                          </>
                        )}

                        {post_ID === "64ada83a04bf47db3a44b9f7" && (
                          <>
                            <ListItem>
                              <ListItemButton sx={{ pl: 4 }} onClick={handleRoomClick}>
                                <ListItemIcon sx={{ color: 'white' }}>
                                  <KingBedIcon />
                                </ListItemIcon>
                                <ListItemText primary="Rooms" />
                              </ListItemButton>
                            </ListItem>

                            <ListItem>
                              <ListItemButton sx={{ pl: 4 }} onClick={handleRoomTypeClick}>
                                <ListItemIcon sx={{ color: 'white' }}>
                                  <NightShelterIcon />
                                </ListItemIcon>
                                <ListItemText primary="Room Types" />
                              </ListItemButton>
                            </ListItem>
                          </>
                        )}

                        {post_ID === "64ada84d04bf47db3a44b9ff" && (
                          <>
                            <ListItem>
                              <ListItemButton sx={{ pl: 4 }} onClick={handleBlogClick}>
                                <ListItemIcon sx={{ color: 'white' }}>
                                  <BookIcon />
                                </ListItemIcon>
                                <ListItemText primary="Blogs" />
                              </ListItemButton>
                            </ListItem>

                            <ListItem>
                              <ListItemButton sx={{ pl: 4 }} onClick={handleSliderClick}>
                                <ListItemIcon sx={{ color: 'white' }}>
                                  <ImageIcon />
                                </ListItemIcon>
                                <ListItemText primary="Sliders" />
                              </ListItemButton>
                            </ListItem>

                            <ListItem>
                              <ListItemButton sx={{ pl: 4 }} onClick={handleTestimonyClick}>
                                <ListItemIcon sx={{ color: 'white' }}>
                                  <MarkUnreadChatAltIcon />
                                </ListItemIcon>
                                <ListItemText primary="Testimonies" />
                              </ListItemButton>
                            </ListItem>
                          </>
                        )}

                        {post_ID === "64ada85804bf47db3a44ba03" && (
                          <>
                            <ListItem>
                              <ListItemButton sx={{ pl: 4 }} onClick={handleWorkPostClick}>
                                <ListItemIcon sx={{ color: 'white' }}>
                                  <WorkIcon />
                                </ListItemIcon>
                                <ListItemText primary="Work Posts" />
                              </ListItemButton>
                            </ListItem>

                            <ListItem>
                              <ListItemButton sx={{ pl: 4 }} onClick={handleReviewClick}>
                                <ListItemIcon sx={{ color: 'white' }}>
                                  <PreviewIcon />
                                </ListItemIcon>
                                <ListItemText primary="Time Tables" />
                              </ListItemButton>
                            </ListItem>

                            <ListItem>
                              <ListItemButton sx={{ pl: 4 }} onClick={handleUserClick}>
                                <ListItemIcon sx={{ color: 'white' }}>
                                  <PersonIcon />
                                </ListItemIcon>
                                <ListItemText primary="Users" />
                              </ListItemButton>
                            </ListItem>
                          </>
                        )}
                      </List>
                    </Collapse>

                    <ListItem>
                      <ListItemButton onClick={handleUserProfileClick}>
                        <ListItemIcon sx={{ color: 'white' }}>
                          <AccountCircleIcon />
                        </ListItemIcon>
                        <ListItemText primary="User Profile" />
                      </ListItemButton>
                    </ListItem>

                  </List>
                </Fade>
              </>
            )}
          </>
        ) : (
          <ListItem>
            <ListItemButton disabled>
              <ListItemIcon sx={{ color: 'white' }}>
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        )}
      </Box>
      {!isOpen && (
        <List sx={{ position: 'relative', zIndex: 1 }}>
          {isLoggedIn ? (
            <>
            <ListItem>
              <ListItemButton onClick={handleHomePageClick}>
                <ListItemIcon sx={{ color: 'white' }}>
                  <PieChartIcon />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
            
              <ListItem>
                <ListItemButton onClick={() => { toggleSidebar(); handleClick(); }}>
                  <ListItemIcon sx={{ color: 'white' }}>
                    <FormatListBulletedIcon />
                  </ListItemIcon>
                </ListItemButton>
              </ListItem>

              <ListItem>
                <ListItemButton onClick={handleUserProfileClick}>
                  <ListItemIcon sx={{ color: 'white' }}>
                    <AccountCircleIcon />
                  </ListItemIcon>
                </ListItemButton>
              </ListItem>

              </>
            ) : (
              <ListItem>
              <ListItemButton disabled>
                <ListItemIcon sx={{ color: 'white' }}>
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
            )}
        </List>
      )}
    </Box>
  );
};

export default Sidebar;