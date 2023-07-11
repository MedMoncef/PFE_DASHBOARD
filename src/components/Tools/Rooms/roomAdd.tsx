import React from 'react';
import { styled } from '@mui/system';
import { Typography, Box, Button, TextField, InputLabel, MenuItem, Grid } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useTable } from '@/context/TableContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const API_URL_ROOMTYPES = 'http://localhost:7000/roomTypes';

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
  minHeight: '100vh',
});

const UserInfo = styled(Typography)({
  textAlign: 'center',
});

const AddRoomPage = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const router = useRouter();
  const [file, setFile] = useState(null);
  const { submitRoomForm } = useTable();
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
      const formData = {
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

      await submitRoomForm(formData);
      toast.success('Room added successfully');
      router.push('/Tables/Rooms/room');
    } else {
      throw new Error('Image added failed');
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
      <ToastContainer />
      <ProfileContainer>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '32px',
            marginBottom: '32px'
          }}
        >
          <UserInfo variant="h4" align="center" sx={{ marginTop: '16px' }}>
            Room Number: {roomNumber}
          </UserInfo>
          <UserInfo variant="body1" align="center" sx={{ marginTop: '16px' }}>
            Floor Number: {floorNumber}
          </UserInfo>
          <UserInfo variant="body1" align="center" sx={{ marginTop: '16px' }}>
            Name: {name}
          </UserInfo>
          <UserInfo variant="body1" align="center" sx={{ marginTop: '16px' }}>
            Description: {description}
          </UserInfo>
          <UserInfo variant="body1" align="center" sx={{ marginTop: '16px' }}>
            Max: {max}
          </UserInfo>
          <UserInfo variant="body1" align="center" sx={{ marginTop: '16px' }}>
            View: {view}
          </UserInfo>
          <UserInfo variant="body1" align="center" sx={{ marginTop: '16px' }}>
            Size: {size}
          </UserInfo>
          <UserInfo variant="body1" align="center" sx={{ marginTop: '16px' }}>
            Bed Number: {bedNumber}
          </UserInfo>
          <UserInfo variant="body1" align="center" sx={{ marginTop: '16px' }}>
            Type: {type}
          </UserInfo>
          <UserInfo variant="body1" align="center" sx={{ marginTop: '16px' }}>
            Price: {price}
          </UserInfo>
        </Box>
      </ProfileContainer>
      <FormContainer>
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

          <InputLabel id="demo-simple-select-label">Image</InputLabel>
            <input type="file" onChange={handleFileChange} />

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
            label="Max"
            type="number"
            variant="outlined"
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
            type="number"
            variant="outlined"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            sx={{ marginBottom: '16px' }}
          />

          <Button type="submit" variant="outlined" color="primary">
            Add Room
          </Button>
          <Grid item xs={12}>
            <Button fullWidth variant="text" onClick={() => router.push('/Tables/Rooms/room')}>
              Go back
            </Button>
          </Grid>
        </Box>
      </FormContainer>
    </OuterContainer>
  );
};

export default AddRoomPage;