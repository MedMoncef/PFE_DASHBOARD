import React from 'react';
import { styled } from '@mui/system';
import { Typography, Box, Avatar, Button, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const API_URL_RESERVATION = 'http://localhost:7000/reservations';

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
  minHeight: '50%',
  boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.25)',
  background: '#ffffff',
  color: 'black',
  borderRadius: '10px',
});

const UserInfo = styled(Typography)({
  textAlign: 'left',
});

const ReservationPage = () => {
  const [reservation, setReservation] = useState(null);
  const router = useRouter();
  const { reservationId } = router.query;

  useEffect(() => {
    if (reservationId) {
      axios.get(`${API_URL_RESERVATION}/${reservationId}`).then((res) => {
        setReservation(res.data);
      });
    }
  }, [reservationId]);

  return (
    <OuterContainer             
      sx={{
        border: '1px solid #ccc',
        borderRadius: '4px',
      }}
    >
      {reservation && (
        <>
          <ProfileContainer>
            <Box
              key={reservation._id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'left',
                padding: '32px',
                marginBottom: '32px'
              }}
            >
              <UserInfo variant="h4" align="center" sx={{ marginTop: '16px' }}>
                {reservation.firstName} {reservation.lastName}
              </UserInfo>
              <UserInfo variant="body1" align="center" sx={{ marginTop: '16px' }}>
                Email: {reservation.Email}
              </UserInfo>
              <UserInfo variant="body2" align="center" sx={{ marginTop: '16px' }}>
                CIN: {reservation.CIN}
              </UserInfo>
              <UserInfo variant="body2" align="center" sx={{ marginTop: '16px' }}>
                Room ID: {reservation.ID_Rooms}
              </UserInfo>
              <UserInfo variant="body2" align="center" sx={{ marginTop: '16px' }}>
                Start Date: {new Date(reservation.Date_Debut).toLocaleDateString()}
              </UserInfo>
              <UserInfo variant="body2" align="center" sx={{ marginTop: '16px' }}>
                End Date: {new Date(reservation.Date_Fin).toLocaleDateString()}
              </UserInfo>
              <UserInfo variant="body2" align="center" sx={{ marginTop: '16px' }}>
                Duration: {reservation.Duree} days
              </UserInfo>
              <UserInfo variant="body2" align="center" sx={{ marginTop: '16px' }}>
                Price: {reservation.Prix}
              </UserInfo>
              <UserInfo variant="body2" align="center" sx={{ marginTop: '16px' }}>
                Paid: {reservation.Paid}
              </UserInfo>
            </Box>
          </ProfileContainer>
          <FormContainer>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', '& .MuiTextField-root': { m: 1, width: '30ch' }, }}>
              <TextField
                required
                id="firstName"
                name="firstName"
                label="First Name"
                variant="outlined"
                value={reservation.firstName}
                sx={{ marginBottom: '16px' }}
              />
              <TextField
                required
                id="lastName"
                name="lastName"
                label="Last Name"
                variant="outlined"
                value={reservation.lastName}
                sx={{ marginBottom: '16px' }}
              />
              <TextField
                required
                id="email"
                name="email"
                label="Email"
                variant="outlined"
                value={reservation.Email}
                sx={{ marginBottom: '16px' }}
              />
              <TextField
                required
                id="cin"
                name="cin"
                label="CIN"
                variant="outlined"
                value={reservation.CIN}
                sx={{ marginBottom: '16px' }}
              />
              <TextField
                required
                id="roomId"
                name="roomId"
                label="Room ID"
                variant="outlined"
                value={reservation.ID_Rooms}
                sx={{ marginBottom: '16px' }}
              />
              <TextField
                required
                id="startDate"
                name="startDate"
                label="Start Date"
                variant="outlined"
                type="date"
                value={reservation.Date_Debut}
                sx={{ marginBottom: '16px' }}
              />
              <TextField
                required
                id="endDate"
                name="endDate"
                label="End Date"
                variant="outlined"
                type="date"
                value={reservation.Date_Fin}
                sx={{ marginBottom: '16px' }}
              />
              <TextField
                required
                id="duration"
                name="duration"
                label="Duration (days)"
                variant="outlined"
                type="number"
                value={reservation.Duree}
                sx={{ marginBottom: '16px' }}
              />
              <TextField
                required
                id="price"
                name="price"
                label="Price"
                variant="outlined"
                type="number"
                value={reservation.Prix}
                sx={{ marginBottom: '16px' }}
              />
              <TextField
                required
                id="paid"
                name="paid"
                label="Paid"
                variant="outlined"
                value={reservation.Paid}
                sx={{ marginBottom: '16px' }}
              />
              <Button type="submit" variant="outlined" color="primary">
                Modify Reservation
              </Button>
            </Box>
          </FormContainer>
        </>
      )}
    </OuterContainer>  
  );
};

export default ReservationPage;