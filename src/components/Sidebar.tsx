import React, { useState } from 'react';
import { Box, List, ListItem, ListItemText, ListItemIcon, Typography, ListItemButton, Fade } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PieChartIcon from '@mui/icons-material/PieChart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import Collapse from '@mui/material/Collapse';
import BookIcon from '@mui/icons-material/Book';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import WorkIcon from '@mui/icons-material/Work';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import PreviewIcon from '@mui/icons-material/Preview';
import KingBedIcon from '@mui/icons-material/KingBed';
import ImageIcon from '@mui/icons-material/Image';
import MarkUnreadChatAltIcon from '@mui/icons-material/MarkUnreadChatAlt';
import PersonIcon from '@mui/icons-material/Person';


const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Box
      sx={{
        width: isOpen ? 275 : 64,
        height: '125vh',
        backgroundImage: "url('/background.jpg')",
        backgroundSize: 'cover',
        transition: 'width 0.2s',
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
        <MenuIcon onClick={toggleSidebar} />
        {isOpen && (
          <>
            <Fade in={isOpen} timeout={500}>
              <List sx={{ position: 'relative', zIndex: 1 }}>
                <ListItemButton component="a" href="/">
                  <ListItemIcon sx={{ color: 'white' }}>
                    <PieChartIcon />
                  </ListItemIcon>
                  <ListItemText primary="Home Page" />
                </ListItemButton>

                <ListItemButton component="a" href="dashboard.html">
                  <ListItemIcon sx={{ color: 'white' }}>
                    <AccountCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="User Profile" />
                </ListItemButton>

                <ListItemButton onClick={handleClick}>
                  <ListItemIcon sx={{ color: 'white' }}>
                    <FormatListBulletedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Table List" />
                  {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4 }}>
                      <ListItemIcon sx={{ color: 'white' }}>
                        <BookIcon />
                      </ListItemIcon>
                      <ListItemText primary="Blog" />
                    </ListItemButton>

                    <ListItemButton sx={{ pl: 4 }}>
                      <ListItemIcon sx={{ color: 'white' }}>
                        <ContactPhoneIcon />
                      </ListItemIcon>
                      <ListItemText primary="Contact Client" />
                    </ListItemButton>

                    <ListItemButton sx={{ pl: 4 }}>
                      <ListItemIcon sx={{ color: 'white' }}>
                        <RestaurantMenuIcon />
                      </ListItemIcon>
                      <ListItemText primary="Menu" />
                    </ListItemButton>

                    <ListItemButton sx={{ pl: 4 }}>
                      <ListItemIcon sx={{ color: 'white' }}>
                        <NotificationsActiveIcon />
                      </ListItemIcon>
                      <ListItemText primary="Notification" />
                    </ListItemButton>

                    <ListItemButton sx={{ pl: 4 }}>
                      <ListItemIcon sx={{ color: 'white' }}>
                        <WorkIcon />
                      </ListItemIcon>
                      <ListItemText primary="Work Post" />
                    </ListItemButton>

                    <ListItemButton sx={{ pl: 4 }}>
                      <ListItemIcon sx={{ color: 'white' }}>
                        <BookmarksIcon />
                      </ListItemIcon>
                      <ListItemText primary="Reservation" />
                    </ListItemButton>

                    <ListItemButton sx={{ pl: 4 }}>
                      <ListItemIcon sx={{ color: 'white' }}>
                        <PreviewIcon />
                      </ListItemIcon>
                      <ListItemText primary="Review" />
                    </ListItemButton>

                    <ListItemButton sx={{ pl: 4 }}>
                      <ListItemIcon sx={{ color: 'white' }}>
                        <KingBedIcon />
                      </ListItemIcon>
                      <ListItemText primary="Room" />
                    </ListItemButton>

                    <ListItemButton sx={{ pl: 4 }}>
                      <ListItemIcon sx={{ color: 'white' }}>
                        <ImageIcon />
                      </ListItemIcon>
                      <ListItemText primary="Slider" />
                    </ListItemButton>

                    <ListItemButton sx={{ pl: 4 }}>
                      <ListItemIcon sx={{ color: 'white' }}>
                        <MarkUnreadChatAltIcon />
                      </ListItemIcon>
                      <ListItemText primary="Testimony" />
                    </ListItemButton>

                    <ListItemButton sx={{ pl: 4 }}>
                      <ListItemIcon sx={{ color: 'white' }}>
                        <PersonIcon />
                      </ListItemIcon>
                      <ListItemText primary="User" />
                    </ListItemButton>

                  </List>
                </Collapse>

                <ListItemButton component="a" href="dashboard.html">
                  <ListItemIcon sx={{ color: 'white' }}>
                    <ConnectWithoutContactIcon />
                  </ListItemIcon>
                  <ListItemText primary="Send a Message" />
                </ListItemButton>

              </List>
            </Fade>
          </>
        )}
      </Box>
      {!isOpen && (
        <List sx={{ position: 'relative', zIndex: 1 }}>
          <ListItemButton component="a" href="dashboard.html">
            <ListItemIcon sx={{ color: 'white' }}>
              <PieChartIcon />
            </ListItemIcon>
          </ListItemButton>

          <ListItemButton component="a" href="dashboard.html">
            <ListItemIcon sx={{ color: 'white' }}>
              <AccountCircleIcon />
            </ListItemIcon>
          </ListItemButton>

          <ListItemButton onClick={handleClick}>
            <ListItemIcon sx={{ color: 'white' }}>
              <FormatListBulletedIcon />
            </ListItemIcon>
          </ListItemButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
            <ListItemButton>
                      <ListItemIcon sx={{ color: 'white' }}>
                        <BookIcon />
                      </ListItemIcon>
                      <ListItemText />
                    </ListItemButton>

                    <ListItemButton>
                      <ListItemIcon sx={{ color: 'white' }}>
                        <ContactPhoneIcon />
                      </ListItemIcon>
                      <ListItemText />
                    </ListItemButton>

                    <ListItemButton>
                      <ListItemIcon sx={{ color: 'white' }}>
                        <RestaurantMenuIcon />
                      </ListItemIcon>
                      <ListItemText />
                    </ListItemButton>

                    <ListItemButton>
                      <ListItemIcon sx={{ color: 'white' }}>
                        <NotificationsActiveIcon />
                      </ListItemIcon>
                      <ListItemText />
                    </ListItemButton>

                    <ListItemButton>
                      <ListItemIcon sx={{ color: 'white' }}>
                        <WorkIcon />
                      </ListItemIcon>
                      <ListItemText />
                    </ListItemButton>

                    <ListItemButton>
                      <ListItemIcon sx={{ color: 'white' }}>
                        <BookmarksIcon />
                      </ListItemIcon>
                      <ListItemText />
                    </ListItemButton>

                    <ListItemButton>
                      <ListItemIcon sx={{ color: 'white' }}>
                        <PreviewIcon />
                      </ListItemIcon>
                      <ListItemText />
                    </ListItemButton>

                    <ListItemButton>
                      <ListItemIcon sx={{ color: 'white' }}>
                        <KingBedIcon />
                      </ListItemIcon>
                      <ListItemText />
                    </ListItemButton>

                    <ListItemButton>
                      <ListItemIcon sx={{ color: 'white' }}>
                        <ImageIcon />
                      </ListItemIcon>
                      <ListItemText />
                    </ListItemButton>

                    <ListItemButton>
                      <ListItemIcon sx={{ color: 'white' }}>
                        <MarkUnreadChatAltIcon />
                      </ListItemIcon>
                      <ListItemText />
                    </ListItemButton>

                    <ListItemButton>
                      <ListItemIcon sx={{ color: 'white' }}>
                        <PersonIcon />
                      </ListItemIcon>
                      <ListItemText />
                    </ListItemButton>
            </List>
          </Collapse>

          <ListItemButton component="a" href="dashboard.html">
            <ListItemIcon sx={{ color: 'white' }}>
              <ConnectWithoutContactIcon />
            </ListItemIcon>
          </ListItemButton>

        </List>
      )}
    </Box>
  );
};

export default Sidebar;