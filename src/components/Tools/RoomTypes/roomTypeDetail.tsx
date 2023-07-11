import React, { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import { Typography, Box, Button, TextField, Grid } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const API_URL_ROOM_TYPE = 'http://localhost:7000/roomTypes';

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
  marginLeft: '20%',
  background: '#ffffff',
  borderRadius: '10px',
  boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.25)',
});

const ProfileContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '50%',
  boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.25)',
  background: '#ffffff',
  color: 'black',
  borderRadius: '10px',
});

const UserInfo = styled(Typography)({
  textAlign: 'left',
});

const RoomTypePage = () => {
  const [roomType, setRoomType] = useState(null);
  const [modifiedRoomType, setModifiedRoomType] = useState({
    Name: '',
  });
  const router = useRouter();
  const { roomTypeId } = router.query;

  useEffect(() => {
    if (roomTypeId) {
      axios.get(`${API_URL_ROOM_TYPE}/${roomTypeId}`).then((res) => {
        setRoomType(res.data);
        setModifiedRoomType(res.data);
      });
    }
  }, [roomTypeId]);

  const handleInputChange = (e) => {
    setModifiedRoomType({
      ...modifiedRoomType,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.put(`${API_URL_ROOM_TYPE}/${roomTypeId}`, modifiedRoomType);
      setRoomType(modifiedRoomType);
      toast.success('Room updated successfully');
      router.push('/Tables/RoomTypes/roomType');
    } catch (error) {
      console.error('Error in form submission:', error);
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
      {roomType && (
        <>
          <ProfileContainer>
            <Box
              key={roomType._id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '32px',
                marginBottom: '32px',
              }}
            >
              <UserInfo variant="h4" align="center" sx={{ marginTop: '16px' }}>
                {roomType.Name}
              </UserInfo>
            </Box>
          </ProfileContainer>
          <FormContainer>
            <Box
              component="form"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                '& .MuiTextField-root': { m: 1, width: '30ch' },
              }}
              onSubmit={handleFormSubmit}
            >
              <TextField
                required
                id="name"
                name="Name"
                label="Name"
                variant="outlined"
                value={modifiedRoomType.Name}
                sx={{ marginBottom: '16px' }}
                onChange={handleInputChange}
              />
              <Button type="submit" variant="outlined" color="primary">
                Modify Room Type
              </Button>
              <Grid item xs={12}>
                <Button fullWidth variant="text" onClick={() => router.push('/Tables/RoomTypes/roomType')}>
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

export default RoomTypePage;