import React from 'react';
import { styled } from '@mui/system';
import { Typography, Box, Avatar, Button, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const API_URL_ROOM_TYPE = 'http://localhost:7000/roomTypes';

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

const RoomTypePage = () => {
  const [roomType, setRoomType] = useState(null);
  const router = useRouter();
  const { roomTypeId } = router.query;

  useEffect(() => {
    if (roomTypeId) {
      axios.get(`${API_URL_ROOM_TYPE}/${roomTypeId}`).then((res) => {
        setRoomType(res.data);
      });
    }
  }, [roomTypeId]);

  return (
    <OuterContainer             
      sx={{
        border: '1px solid #ccc',
        borderRadius: '4px',
      }}
    >
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
                marginBottom: '32px'
              }}
            >
              <UserInfo variant="h4" align="center" sx={{ marginTop: '16px' }}>
                {roomType.Name}
              </UserInfo>
            </Box>
          </ProfileContainer>
          <FormContainer>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', '& .MuiTextField-root': { m: 1, width: '30ch' }, }}>
              <TextField
                required
                id="name"
                name="name"
                label="Name"
                variant="outlined"
                value={roomType.Name}
                sx={{ marginBottom: '16px' }}
              />
              <Button type="submit" variant="outlined" color="primary">
                Modify Room Type
              </Button>
            </Box>
          </FormContainer>
        </>
      )}
    </OuterContainer>  
  );
};

export default RoomTypePage;