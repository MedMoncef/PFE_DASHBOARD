import { Box, Card, CardContent, Typography, LinearProgress, Grid } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import TimeTablesTable from '@/components/Tools/TableTime';
import AnnouncementsTable from '@/components/Tools/Announcements/tableAnnouncementHome';
import MessagesPage from '@/components/Tools/chat';
import styles from '@/styles/Title.module.css';
import KingBedIcon from '@mui/icons-material/KingBed';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import jwt_decode from 'jwt-decode';

const API_URL_USER = 'http://localhost:7000/users';
const API_URL_ROOM = 'http://localhost:7000/rooms';
const API_URL_RESERVATION = 'http://localhost:7000/reservations';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [user_ID, setUser_ID] = useState("");
  const [post_ID, setPost_ID] = useState("");
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      const token = localStorage.getItem('token');
      const decodedToken = jwt_decode(token);
      setUser_ID(decodedToken.user_id);
      setPost_ID(decodedToken.id_post);
    }
  }, [isLoggedIn]);
  
  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL_USER);
      const response1 = await axios.get(API_URL_ROOM);
      const response2 = await axios.get(API_URL_RESERVATION);
  
      const allReservations = response2.data;
      const validReservations = allReservations.filter(reservation => reservation.Paid === "Valid");
  
      setUsers(response.data);
      setRooms(response1.data);
      setReservations(validReservations);
  
    } catch (error) {
      console.error(error);
    }
  };
      
  useEffect(() => {
    fetchData();
  }, []);
  
  const userCount = users.length;
  const roomCount = rooms.length;
  const reservationCount = reservations.length;
  


  return (
    <Box sx={{ flexGrow: 1, backgroundColor: 'white' }}>
      <div className={styles.title}>
        <h2>Hotel Information</h2>
      </div>
      <Box sx={{ p: 3 }}>
        <Grid container spacing={2}>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ display: 'flex' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                  <Typography component="div" variant="h5">
                    Staff Available
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" component="div">
                    {userCount}
                  </Typography>
                </CardContent>
                <Box sx={{ pb: 2, marginLeft: '20px' }}>
                  <LinearProgress variant="determinate" value={userCount} />
                </Box>
              </Box>
              <PeopleIcon sx={{ fontSize: '8rem', margin: '10px', color: '#3f51b5' }} />
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ display: 'flex' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                  <Typography component="div" variant="h5">
                    Rooms Available
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" component="div">
                    {roomCount}
                  </Typography>
                </CardContent>
                <Box sx={{ pb: 2, marginLeft: '20px' }}>
                  <LinearProgress variant="determinate" value={roomCount} />
                </Box>
              </Box>
              <KingBedIcon sx={{ fontSize: '8rem', margin: '10px', color: '#3f51b5' }} />
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ display: 'flex' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                  <Typography component="div" variant="h5">
                    Valid Reservations
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" component="div">
                    {reservationCount}
                  </Typography>
                </CardContent>
                <Box sx={{ pb: 2, marginLeft: '20px' }}>
                  <LinearProgress variant="determinate" value={reservationCount} />
                </Box>
              </Box>
              <BookmarksIcon sx={{ fontSize: '8rem', margin: '10px', color: '#3f51b5' }} />
            </Card>
          </Grid>

        </Grid>
      </Box>

        <AnnouncementsTable />

        <TimeTablesTable />

        {post_ID !== "64b1b83d75bcad49499889db" && <MessagesPage />}

    </Box>
  );
};

export default Dashboard;