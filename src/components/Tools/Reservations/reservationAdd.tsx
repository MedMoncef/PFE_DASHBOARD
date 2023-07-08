import React, { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import { Typography, Box, Button, TextField, Select, MenuItem, InputLabel } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useTable } from '@/context/TableContext';

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
  const { submitReservationForm } = useTable();
  const [rooms, setRooms] = useState([]);
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [CIN, setCIN] = useState("");
  const [IDRooms, setIDRooms] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [paid, setPaid] = useState("");
  const [dayPrice, setDayPrice] = useState("");

  const startDate = new Date(dateDebut);
  const endDate = new Date(dateFin);
  const durationMs = endDate.getTime() - startDate.getTime();
  const Duree = Math.ceil(durationMs / (1000 * 60 * 60 * 24));
  const Prix = Duree*Number(dayPrice)

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const reservationFormData = {
        firstName,
        lastName,
        Email: email,
        CIN,
        ID_Rooms: IDRooms,
        Date_Debut: dateDebut,
        Date_Fin: dateFin,
        Duree: Duree,
        Prix: Prix,
        Paid: paid,
      };

      submitReservationForm(reservationFormData);
      console.log('Reservation added successfully');
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };
  
  const goBackToTable = (e => {
    router.push('/Tables/Reservations/reservation');  
  })

  const fetchData = async () => {
    const result = await axios(API_URL_ROOM);
    setRooms(result.data);
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  const saveRoomPrice = async (roomPrice) => {
    setDayPrice(roomPrice);
  }

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
        <>
          <ProfileContainer>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'left',
                padding: '32px',
                marginBottom: '32px',
              }}
            >
              <UserInfo variant="h4" align="center" sx={{ marginTop: '16px' }}>
                {firstName} {lastName}
              </UserInfo>
              <UserInfo variant="body1" align="center" sx={{ marginTop: '16px' }}>
                Email: {email}
              </UserInfo>
              <UserInfo variant="body2" align="center" sx={{ marginTop: '16px' }}>
                CIN: {CIN}
              </UserInfo>
              <UserInfo variant="body2" align="center" sx={{ marginTop: '16px' }}>
                Room Type: {IDRooms.Name}
              </UserInfo>
              <UserInfo variant="body2" align="center" sx={{ marginTop: '16px' }}>
                Start Date: {new Date(dateDebut).toLocaleDateString()}
              </UserInfo>
              <UserInfo variant="body2" align="center" sx={{ marginTop: '16px' }}>
                End Date: {new Date(dateFin).toLocaleDateString()}
              </UserInfo>
              <UserInfo variant="body2" align="center" sx={{ marginTop: '16px' }}>
                Duration: {Duree} days
              </UserInfo>
              <UserInfo variant="body2" align="center" sx={{ marginTop: '16px' }}>
                Price: {Prix}
              </UserInfo>
              <UserInfo variant="body2" align="center" sx={{ marginTop: '16px' }}>
                Paid: {paid}
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
                value={firstName}
                sx={{ marginBottom: '16px' }}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <TextField
                required
                id="lastName"
                name="lastName"
                label="Last Name"
                variant="outlined"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                sx={{ marginBottom: '16px' }}
              />
              <TextField
                required
                id="email"
                name="Email"
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ marginBottom: '16px' }}
              />
              <TextField
                required
                id="cin"
                name="CIN"
                label="CIN"
                variant="outlined"
                value={CIN}
                onChange={(e) => setCIN(e.target.value)}
                sx={{ marginBottom: '16px' }}
              />

              <InputLabel id="demo-simple-select-label">Room Types</InputLabel>
              {rooms && (
                <Select
                  value={IDRooms}
                  id="roomId"
                  name="ID_Rooms"
                  label="Room Type"
                  onChange={(e) => setIDRooms(e.target.value)}
                  sx={{ marginBottom: '16px' }}
                >
                  {rooms.map((room: Rooms) => (
                    <MenuItem key={room._id} value={room._id} onClick={() => saveRoomPrice(room.Price)}>{room.Name}</MenuItem>
                  ))}
                </Select>
              )}

              <InputLabel id="demo-simple-select-label">Start Date</InputLabel>
              <TextField
                required
                id="startDate"
                name="Date_Debut"
                variant="outlined"
                type="date"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
                sx={{ marginBottom: '16px' }}
              />

              <InputLabel id="demo-simple-select-label">End Date</InputLabel>
              <TextField
                required
                id="endDate"
                name="Date_Fin"
                variant="outlined"
                type="date"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
                sx={{ marginBottom: '16px' }}
              />

              <InputLabel id="demo-simple-select-label">Payment</InputLabel>
                <Select
                  id="paid"
                  name="Paid"
                  label="Paid"
                  value={paid}
                  onChange={(e) => setPaid(e.target.value)}
                  sx={{ marginBottom: '16px' }}
                >
                    <MenuItem value="Valid">Valid</MenuItem>
                    <MenuItem value="Invalid">Invalid</MenuItem>
                </Select>

              <Button type="submit" variant="outlined" color="primary">
                Add Reservation
              </Button>
              <Button variant="text" color="primary" onClick={goBackToTable}>
                Go back!
              </Button>
            </Box>
          </FormContainer>
        </>
    </OuterContainer>
  );
};

export default ReservationPage;