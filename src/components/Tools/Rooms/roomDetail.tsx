import React from 'react';
import { styled } from '@mui/system';
import { Typography, Box, Avatar, Button, TextField, InputLabel, MenuItem } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { CldImage } from 'next-cloudinary';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useTable } from '@/context/TableContext';
import { toast } from 'react-toastify';

const API_URL_ROOM = 'http://localhost:7000/rooms';
const API_URL_ROOMTYPES = 'http://localhost:7000/roomTypes';

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

const UserInfo = styled(Typography)({
  textAlign: 'center',
});

const RoomPage = () => {
  const [room, setRoom] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]);
  const router = useRouter();
  const { roomId } = router.query;
  const [file, setFile] = useState(null);
  const { updateById } = useTable();
  const [roomNumber, setRoomNumber] = useState("");
  const [floorNumber, setFloorNumber] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [max, setMax] = useState("");
  const [view, setView] = useState("");
  const [size, setSize] = useState("");
  const [bedNumber, setBedNumber] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  
  useEffect(() => {
    if (roomId) {
      axios.get(`${API_URL_ROOM}/${roomId}`).then((res) => {
        setRoom(res.data);
        setRoomNumber(res.data.Room_Number);
        setFloorNumber(res.data.Floor_Number);
        setName(res.data.Name);
        setDescription(res.data.Description);
        setMax(res.data.Max);
        setView(res.data.View);
        setSize(res.data.Size);
        setBedNumber(res.data.Bed_Number);
        setType(res.data.Type);
        setPrice(res.data.Price);
      });
    }
  }, [roomId]);
  

  const fetchData = async () => {
    const result = await axios(API_URL_ROOMTYPES);
    setRoomTypes(result.data);
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (event: SelectChangeEvent) => {
    setType(event.target.value as string);
  };

  interface Types {
    _id: string;
    Name: string;
  }

const handleFileChange = (e) => {
  const selectedFile = e.target.files[0];
  setFile(selectedFile);
};

const uploadImage = async (): Promise<string> => {
  return new Promise<string>(async (resolve, reject) => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'HarborHotel');
        const filenameWithoutExtension = file.name.replace(/\.[^/.]+$/, ""); // Remove file extension
        formData.append('public_id', `Rooms/${filenameWithoutExtension}`);
        setImage(String(file.name));

        await axios.post('https://api.cloudinary.com/v1_1/dv5o7w2aw/upload', formData);

        // Handle the response or perform additional operations
        console.log('File uploaded successfully');

        resolve(file.name); // Return file name
      } catch (error) {
        console.error('Error uploading file:', error);
        reject(error);
      }
    } else {
      resolve('');
    }
  });
};

const handleFormSubmit = async (event) => {
  event.preventDefault();

  try {
    let imageName = '';
    if (file) {
      imageName = await uploadImage();
    }

    if (imageName || imageName === '') {
      const roomData = {
        Room_Number: roomNumber,
        Floor_Number: floorNumber,
        Name: name,
        Image: imageName,
        Description: description,
        Max: max,
        View: view,
        Size: size,
        Bed_Number: bedNumber,
        Type: type,
        Price: price,
      };

      await updateById("rooms", roomId, roomData);
      toast.success('Room updated successfully');
    } else {
      throw new Error('Image upload failed');
    }
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
            <Box component="form" onSubmit={handleFormSubmit} sx={{ display: 'flex', flexDirection: 'column', '& .MuiTextField-root': { m: 1, width: '30ch' }, }}>
              <TextField
                required
                id="roomNumber"
                name="roomNumber"
                label="Room Number"
                variant="outlined"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                sx={{ marginBottom: '16px' }}
              />
              <TextField
                required
                id="floorNumber"
                name="floorNumber"
                label="Floor Number"
                variant="outlined"
                value={floorNumber}
                onChange={(e) => setFloorNumber(e.target.value)}
                sx={{ marginBottom: '16px' }}
              />
              <TextField
                required
                id="name"
                name="name"
                label="Name"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                sx={{ marginBottom: '16px' }}
              />
              <TextField
                required
                id="max"
                name="max"
                label="Max Occupancy"
                variant="outlined"
                type="number"
                value={max}
                onChange={(e) => setMax(e.target.value)}
                sx={{ marginBottom: '16px' }}
              />
              <TextField
                required
                id="view"
                name="view"
                label="View"
                variant="outlined"
                value={view}
                onChange={(e) => setView(e.target.value)}
                sx={{ marginBottom: '16px' }}
              />
              <TextField
                required
                id="size"
                name="size"
                label="Size"
                variant="outlined"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                sx={{ marginBottom: '16px' }}
              />
              <TextField
                required
                id="bedNumber"
                name="bedNumber"
                label="Bed Number"
                variant="outlined"
                value={bedNumber}
                onChange={(e) => setBedNumber(e.target.value)}
                sx={{ marginBottom: '16px' }}
              />
              <InputLabel id="demo-simple-select-label">Room Types</InputLabel>
              {roomTypes && (
                <Select
                  value={type}
                  label="Role"
                  onChange={handleChange}
                  sx={{ mb: 2, width: 'auto' }}
                >
                  {roomTypes.map((type: Types) => (
                    <MenuItem key={type._id} value={type._id}>{type.Name}</MenuItem>
                  ))}
                </Select>
              )}
              <TextField
                required
                id="price"
                name="price"
                label="Price"
                variant="outlined"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                sx={{ marginBottom: '16px' }}
              />
              
              <InputLabel id="demo-simple-select-label">Image</InputLabel>
                <input type="file" onChange={handleFileChange} />

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