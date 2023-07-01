import React from 'react';
import { styled } from '@mui/system';
import { Typography, Box, Avatar, Button, TextField, InputLabel } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { CldImage } from 'next-cloudinary';

const API_URL_ROOM = 'http://localhost:7000/rooms';

const OuterContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  width: '100%',
  padding: '0 20px',
  background: 'linear-gradient(45deg, #6f5df0 30%, #bcb4fa 90%)',
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
  minHeight: '100vh',
});

const UserAvatar = styled(Avatar)({
  width: '200px',
  height: '200px',
  marginBottom: '16px',
});

const UserInfo = styled(Typography)({
  textAlign: 'center',
});

const RoomPage = () => {
  const [room, setRoom] = useState(null);
  const router = useRouter();
  const { roomId } = router.query;

  useEffect(() => {
    if (roomId) {
      axios.get(`${API_URL_ROOM}/${roomId}`).then((res) => {
        setRoom(res.data);
      });
    }
  }, [roomId]);

  return (
    <OuterContainer             
      sx={{
        border: '1px solid #ccc',
        borderRadius: '4px',
      }}
    >
      {room && (
        <>
          <ProfileContainer>
            <Box
              key={room._id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '32px',
                marginBottom: '32px'
              }}
            >
              <CldImage width="500" height="500" src={`/Rooms/${room.Image}`} alt={room.Image}/>
              <UserInfo variant="h4" align="center" sx={{ marginTop: '16px' }}>
                Name: {room.Name}
              </UserInfo>
              <UserInfo variant="h5" align="center" sx={{ marginTop: '16px' }}>
                Type: {room.Type.Name}
              </UserInfo>
              <UserInfo variant="body1" align="center" sx={{ marginTop: '16px' }}>
                Room Number: {room.Room_Number}
              </UserInfo>
              <UserInfo variant="body1" align="center" sx={{ marginTop: '16px' }}>
                Floor Number: {room.Floor_Number}
              </UserInfo>
              <UserInfo variant="body1" align="center" sx={{ marginTop: '16px' }}>
                Room Description: {room.Description}
              </UserInfo>
              <UserInfo variant="body2" align="center" sx={{ marginTop: '16px' }}>
                Price: {room.Price} $
              </UserInfo>
              <UserInfo variant="body2" align="center" sx={{ marginTop: '16px' }}>
                Max Capacity: {room.Max} People
              </UserInfo>
              <UserInfo variant="body2" align="center" sx={{ marginTop: '16px' }}>
                View: {room.View}
              </UserInfo>
            </Box>
          </ProfileContainer>
          <FormContainer sx={{ m: '1% 0' }}>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', '& .MuiTextField-root': { m: 1, width: '30ch' }, }}>
              <TextField
                required
                id="roomNumber"
                name="roomNumber"
                label="Room Number"
                variant="outlined"
                value={room.Room_Number}
                sx={{ marginBottom: '16px' }}
              />
              <TextField
                required
                id="floorNumber"
                name="floorNumber"
                label="Floor Number"
                variant="outlined"
                value={room.Floor_Number}
                sx={{ marginBottom: '16px' }}
              />
              <TextField
                required
                id="name"
                name="name"
                label="Name"
                variant="outlined"
                value={room.Name}
                sx={{ marginBottom: '16px' }}
              />
              <TextField
                required
                id="image"
                name="image"
                label="Image"
                variant="outlined"
                value={room.Image}
                sx={{ marginBottom: '16px' }}
              />
              <TextField
                required
                id="description"
                name="description"
                label="Description"
                variant="outlined"
                multiline
                rows={4}
                value={room.Description}
                sx={{ marginBottom: '16px' }}
              />
              <TextField
                required
                id="max"
                name="max"
                label="Max Occupancy"
                variant="outlined"
                type="number"
                value={room.Max}
                sx={{ marginBottom: '16px' }}
              />
              <TextField
                required
                id="view"
                name="view"
                label="View"
                variant="outlined"
                value={room.View}
                sx={{ marginBottom: '16px' }}
              />
              <TextField
                required
                id="size"
                name="size"
                label="Size"
                variant="outlined"
                value={room.Size}
                sx={{ marginBottom: '16px' }}
              />
              <TextField
                required
                id="bedNumber"
                name="bedNumber"
                label="Bed Number"
                variant="outlined"
                value={room.Bed_Number}
                sx={{ marginBottom: '16px' }}
              />
              <TextField
                required
                id="type"
                name="type"
                label="Type"
                variant="outlined"
                value={room.Type.Name}
                sx={{ marginBottom: '16px' }}
              />
              <TextField
                required
                id="price"
                name="price"
                label="Price"
                variant="outlined"
                type="number"
                value={room.Price}
                sx={{ marginBottom: '16px' }}
              />
              <Button type="submit" variant="outlined" color="primary">
                Modify Room
              </Button>
            </Box>
          </FormContainer>
        </>
      )}
    </OuterContainer>  
  );
};

export default RoomPage;