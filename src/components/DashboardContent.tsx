import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Button,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StoreIcon from '@mui/icons-material/Store';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 500 },
  { name: 'Apr', value: 200 },
  { name: 'May', value: 600 },
];

const Dashboard = () => {
  return (
    <Box sx={{ flexGrow: 1, backgroundColor: 'white' }}>
      {/* AppBar for NavBar */}
      <AppBar position="static" sx={{backgroundImage: "url('/background.jpg')"}}>
        <Toolbar sx={{ justifyContent: 'space-between', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
          {/* Logo */}
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

          {/* Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit">
              <NotificationsIcon />
            </IconButton>
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

      {/* Dashboard content */}
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, flexWrap: 'wrap' }}>
          {/* Users Card */}
          <Card sx={{ minWidth: 275, backgroundColor: '#f0f4f8', borderRadius: '12px' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PeopleIcon sx={{ fontSize: '2.5rem', marginRight: '8px', color: '#3f51b5' }} />
                <Typography variant="h6" component="div">
                  Users
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                500
              </Typography>
            </CardContent>
            <LineChart width={250} height={100} data={data}>
              <Line type="monotone" dataKey="value" stroke="#3f51b5" />
              <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </Card>

          {/* Products Card */}
          <Card sx={{ minWidth: 275, backgroundColor: '#f0f4f8', borderRadius: '12px' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <StoreIcon sx={{ fontSize: '2.5rem', marginRight: '8px', color: '#4caf50' }} />
                <Typography variant="h6" component="div">
                  Products
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                1000
              </Typography>
            </CardContent>
            <LineChart width={250} height={100} data={data}>
              <Line type="monotone" dataKey="value" stroke="#4caf50" />
              <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </Card>

          {/* Orders Card */}
          <Card sx={{ minWidth: 275, backgroundColor: '#f0f4f8', borderRadius: '12px' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ShoppingCartIcon sx={{ fontSize: '2.5rem', marginRight: '8px', color: '#f44336' }} />
                <Typography variant="h6" component="div">
                  Orders
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                200
              </Typography>
            </CardContent>
            <LineChart width={250} height={100} data={data}>
              <Line type="monotone" dataKey="value" stroke="#f44336" />
              <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </Card>

          {/* Revenue Card */}
          <Card sx={{ minWidth: 275, backgroundColor: '#f0f4f8', borderRadius: '12px' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AttachMoneyIcon sx={{ fontSize: '2.5rem', marginRight: '8px', color: '#ffb300' }} />
                <Typography variant="h6" component="div">
                  Revenue
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                $10,000
              </Typography>
            </CardContent>
            <LineChart width={250} height={100} data={data}>
              <Line type="monotone" dataKey="value" stroke="#ffb300" />
              <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;