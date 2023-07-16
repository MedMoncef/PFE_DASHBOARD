import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import { useRouter } from 'next/router';
import styles from '@/styles/Title.module.css';
import { useAuth } from '@/context/AuthContext';
import jwt_decode from 'jwt-decode';

const API_URL = 'http://localhost:7000/announcements';

interface Announcement {
  _id: string;
  Message: string;
  ID_Sent: string;
  ID_SentTo: string;
}

const AnnouncementsTable = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [user_ID, setUser_ID] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL);
        setAnnouncements(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      const token = localStorage.getItem('token');
      const decodedToken = jwt_decode(token);
      setUser_ID(decodedToken.user_id);
    }
  }, [isLoggedIn]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: 'white',
        p: 3,
        overflow: 'auto',
        maxHeight: 'auto',
      }}
    >
      <div className={styles.title}>
        <h2>Announcement</h2>
      </div>


      {announcements.map((announcement) => (
        (announcement.ID_SentTo === "All" || announcement.ID_SentTo === user_ID) && (
          <Card key={announcement._id} sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography color="text.secondary">
                To {announcement.ID_SentTo}
              </Typography>
              <Typography variant="h5" component="div">
                {announcement.Message}
              </Typography>
            </CardContent>
          </Card>
        )
      ))}

    </Box>
  );
};

export default AnnouncementsTable;