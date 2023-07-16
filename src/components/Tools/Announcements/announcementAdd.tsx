import React, { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import { Box, Button, TextField, InputLabel, MenuItem } from '@mui/material';
import { toast } from 'react-toastify';
import { useTable } from '@/context/TableContext';  // You may want to change this to an appropriate context for Announcement
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useRouter } from 'next/router';
import jwt_decode from 'jwt-decode';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { CldImage } from 'next-cloudinary';

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

interface User {
  _id: string;
  nom: string;
  prenom: string;
  dateN: string;
  email: string;
  password: string;
  image: string;
  id_post: string;
}

const AddAnnouncementPage = () => {
  const [Message, setMessage] = useState("");
  const [ID_Sent, setID_Sent] = useState("");
  const [ID_SentTo, setID_SentTo] = useState("");
  const [userList, setUserList] = useState(null);
  const { submitAnnouncementForm } = useTable(); // You should update this to use a suitable context or function for handling the Announcement form submission
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      const token = localStorage.getItem('token');
      const decodedToken = jwt_decode(token);
      setID_Sent(decodedToken.user_id);
    }
  }, [isLoggedIn]);

  const handleAddFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = {
        Message,
        ID_Sent,
        ID_SentTo,
      };

      await submitAnnouncementForm(formData);
      toast.success('Announcement added successfully');
      router.push('/Tables/Announcements/announcement'); // Navigate to where you want after successful submission
    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error('Something went wrong.');
    }
  };

  const goBackToDashboard = (e => {
    router.push('/dashboard');  
  })

  const fetchData = async () => {
    const result = await axios(`http://localhost:7000/users`);
    setUserList(result.data);
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (event: SelectChangeEvent) => {
    setID_SentTo(event.target.value as string);
  };

  return (
    <OuterContainer
      sx={{
        border: '1px solid #ccc',
        borderRadius: '4px',
      }}
    >
      <ToastContainer />
      <FormContainer>
        <Box component="form" onSubmit={handleAddFormSubmit} sx={{ display: 'flex', flexDirection: 'column', '& .MuiTextField-root': { m: 1, width: '30ch' }, }}>
          <TextField
            required
            id="message"
            name="message"
            label="Message"
            variant="outlined"
            multiline
            rows={4}
            value={Message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{ marginBottom: '16px' }}
          />

            <InputLabel id="demo-simple-select-label">User List</InputLabel>
              {userList && (
                <Select
                  value={ID_SentTo}
                  id="type"
                  name="type"
                  label="Type"
                  onChange={handleChange}
                  sx={{ mb: 2, width: 'auto' }}
              >
                  <MenuItem value="All">All</MenuItem>
                  {userList.map((list: User) => (
                  <MenuItem key={list._id} value={list._id}><CldImage width="50" height="50" src={`/Users/${list.image}`} alt={list.image} style={{ borderRadius: '50%', objectFit: 'cover' }}/>‎ ‎ {list.nom} {list.prenom}</MenuItem>
                  ))}
              </Select>
              )}

          <Button type="submit" variant="outlined" color="primary">
            Add Announcement
          </Button>
          <Button variant="text" color="primary" onClick={goBackToDashboard}>
            Go back!
          </Button>
        </Box>
      </FormContainer>
    </OuterContainer>
  );
};

export default AddAnnouncementPage;