import React, { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import { Typography, Box, InputLabel, Button, TextField, Grid, Card, CardContent } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useTable } from '@/context/TableContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const API_URL_ANNOUNCEMENT = 'http://localhost:7000/announcements'; // Replace the slider API with your announcement API

const OuterContainer = styled('div')({
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  backgroundImage: "url('https://images.unsplash.com/photo-1530229540764-5f6ab595fdbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80')",
  backgroundSize: 'cover',
});

const FormContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  padding: '20px',
  background: '#ffffff',
  borderRadius: '10px',
  boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.25)',
});

const AnnouncementPage = () => {
  const [announcement, setAnnouncement] = useState(null);
  const router = useRouter();
  const { announcementId } = router.query;
  const { updateById } = useTable();
  const [message, setMessage] = useState("");

  useEffect(() => {
    console.log(announcementId);
    if (announcementId) {
      axios.get(`${API_URL_ANNOUNCEMENT}/${announcementId}`).then((res) => {
        setAnnouncement(res.data);
        setMessage(res.data.Message);
      });
    }
  }, [announcementId]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const announcementData = {
        Message: message,
      };
  
      await updateById("announcements", announcementId, announcementData);
      toast.success('Announcement updated successfully');
      router.push('/Tables/Announcements/announcement');
    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error('Something went wrong.');
    }
  };

  return (
    <OuterContainer
      sx={{
        border: '1px solid #ccc',
        borderRadius: '4px',
      }}
    >
      <ToastContainer />
      {announcement && (
        <>
          <FormContainer>
            <Box component="form" onSubmit={handleFormSubmit} sx={{ display: 'flex', flexDirection: 'column', '& .MuiTextField-root': { m: 1, width: '30ch' }, }}>

              <TextField
                required
                id="message"
                name="message"
                label="Message"
                variant="outlined"
                multiline
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                sx={{ marginBottom: '16px' }}
              />
              <Button type="submit" variant="outlined" color="primary">
                Modify Announcement
              </Button>
              <Grid item xs={12}>
                <Button fullWidth variant="text" onClick={() => router.push('/Tables/Announcements/announcement')}>
                  Go back
                </Button>
              </Grid>
            </Box>
          </FormContainer>
        </>
      )}
    </OuterContainer>
  );
};

export default AnnouncementPage;