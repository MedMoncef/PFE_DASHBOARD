import React, { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import { Typography, Box, Button, TextField, Select, MenuItem, InputLabel } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';

const API_URL_RESERVATION = 'http://localhost:7000/reservations';
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
  minHeight: '50%',
  boxShadow: 'linear-gradient(45deg, #6f5df0 30%, #bcb4fa 90%)',
  background: '#ffffff',
  color: 'black',
  borderRadius: '10px',
});

const UserInfo = styled(Typography)({
  textAlign: 'left',
});

const ReservationPage = () => {
  const [reservation, setReservation] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [modifiedReservation, setModifiedReservation] = useState({
    firstName: '',
    lastName: '',
    Email: '',
    CIN: '',
    ID_Rooms: '',
    Date_Debut: '',
    Date_Fin: '',
    Duree: 0,
    Prix: 0,
    Paid: '',
  });
  const router = useRouter();
  const { reservationId } = router.query;

  useEffect(() => {
    if (reservationId) {
      axios.get(`${API_URL_RESERVATION}/${reservationId}`).then((res) => {
        setReservation(res.data);
        setModifiedReservation(res.data);
      });
    }
  }, [reservationId]);

  const handleInputChange = (e) => {
    setModifiedReservation({
      ...modifiedReservation,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.put(`${API_URL_RESERVATION}/${reservationId}`, modifiedReservation);
      setReservation(modifiedReservation);
      console.log('Reservation updated successfully');
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };

  const fetchData = async () => {
    const result = await axios(API_URL_ROOM);
    setRooms(result.data);
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  interface Rooms {
    _id: String;
    ID_Rooms: string;
    Room_Number: string;
    Floor_Number: string;
    Name: string;
    Image: string;
    Description: string;
    Max: number;
    View: string;
    Size: string;
    Bed_Number: string;
    Type: string;
    Rating: number;
    Price: number;
  }

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
                marginBottom: '32px',
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
                Room Type: {reservation.ID_Rooms.Name}
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
                id="firstName"
                name="firstName"
                label="First Name"
                variant="outlined"
                value={modifiedReservation.firstName}
                sx={{ marginBottom: '16px' }}
                onChange={handleInputChange}
              />
              <TextField
                required
                id="lastName"
                name="lastName"
                label="Last Name"
                variant="outlined"
                value={modifiedReservation.lastName}
                sx={{ marginBottom: '16px' }}
                onChange={handleInputChange}
              />
              <TextField
                required
                id="email"
                name="Email"
                label="Email"
                variant="outlined"
                value={modifiedReservation.Email}
                sx={{ marginBottom: '16px' }}
                onChange={handleInputChange}
              />
              <TextField
                required
                id="cin"
                name="CIN"
                label="CIN"
                variant="outlined"
                value={modifiedReservation.CIN}
                sx={{ marginBottom: '16px' }}
                onChange={handleInputChange}
              />
              <TextField
                required
                id="roomId"
                name="ID_Rooms"
                label="Room Type"
                variant="outlined"
                value={modifiedReservation.ID_Rooms.Name}
                sx={{ marginBottom: '16px' }}
                onChange={handleInputChange}
              />

              <InputLabel id="demo-simple-select-label">Room Types</InputLabel>
              {rooms && (
                <Select
                  value={modifiedReservation.ID_Rooms.Name}
                  id="roomId"
                  name="ID_Rooms"
                  label="Room Type"
                  onChange={handleInputChange}
                  sx={{ mb: 2, width: 'auto' }}
                >
                  {rooms.map((room: Rooms) => (
                    <MenuItem key={room._id} value={room._id}>{room.Name}</MenuItem>
                  ))}
                </Select>
              )}

              <TextField
                required
                id="startDate"
                name="Date_Debut"
                label="Start Date"
                variant="outlined"
                type="date"
                value={modifiedReservation.Date_Debut}
                sx={{ marginBottom: '16px' }}
                onChange={handleInputChange}
              />
              <TextField
                required
                id="endDate"
                name="Date_Fin"
                label="End Date"
                variant="outlined"
                type="date"
                value={modifiedReservation.Date_Fin}
                sx={{ marginBottom: '16px' }}
                onChange={handleInputChange}
              />
              <TextField
                required
                id="duration"
                name="Duree"
                label="Duration (days)"
                variant="outlined"
                type="number"
                value={modifiedReservation.Duree}
                sx={{ marginBottom: '16px' }}
                onChange={handleInputChange}
              />
              <TextField
                required
                id="price"
                name="Prix"
                label="Price"
                variant="outlined"
                type="number"
                value={modifiedReservation.Prix}
                sx={{ marginBottom: '16px' }}
                onChange={handleInputChange}
              />

              <InputLabel id="demo-simple-select-label">Payment</InputLabel>
                <Select
                  value={modifiedReservation.Paid}
                  id="paid"
                  name="Paid"
                  label="Paid"
                  onChange={handleInputChange}
                  sx={{ mb: 2, width: 'auto' }}
                >
                    <MenuItem value="Valid">Valid</MenuItem>
                    <MenuItem value="Invalid">Invalid</MenuItem>
                </Select>

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