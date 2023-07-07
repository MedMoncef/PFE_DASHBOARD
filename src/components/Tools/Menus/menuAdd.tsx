import React, { useState } from 'react';
import { styled } from '@mui/system';
import { Typography, Box, InputLabel, Button, TextField, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTable } from '@/context/TableContext';

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

const AddMenuPage = () => {
  const [file, setFile] = useState(null);
  const [Image, setImage] = useState("");
  const [Nom, setNom] = useState("");
  const [Description, setDescription] = useState("");
  const [Prix, setPrix] = useState(0);
  const [Type, setType] = useState("");
  const { submitMenuForm } = useTable();

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
          formData.append('public_id', `Menu/${filenameWithoutExtension}`);
          setImage(String(file.name));

          await axios.post('https://api.cloudinary.com/v1_1/dv5o7w2aw/upload', formData);

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

  const handleAddFormSubmit = async (event) => {
    event.preventDefault();

    try {
      let imageName = '';
      if (file) {
        imageName = await uploadImage();
      }

      if (imageName || imageName === '') {
        const menuFormData = {
          Image,
          Nom,
          Description,
          Prix,
          Type,
        };

        await submitMenuForm(menuFormData);
        toast.success('Menu added successfully');
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
            Image: {Image}
          </UserInfo>
          <UserInfo variant="body1" align="center" sx={{ marginTop: '16px' }}>
            Nom: {Nom}
          </UserInfo>
          <UserInfo variant="body1" align="center" sx={{ marginTop: '16px' }}>
            Description: {Description}
          </UserInfo>
          <UserInfo variant="body1" align="center" sx={{ marginTop: '16px' }}>
            Prix: {Prix}
          </UserInfo>
          <UserInfo variant="body1" align="center" sx={{ marginTop: '16px' }}>
            Type: {Type}
          </UserInfo>
        </Box>
      </ProfileContainer>
      <FormContainer>
        <Box
          component="form"
          onSubmit={handleAddFormSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            '& .MuiTextField-root': { m: 1, width: '30ch' },
          }}
        >
          <InputLabel id="demo-simple-select-label">Upload an Image</InputLabel>
          <input type="file" onChange={handleFileChange} />
          <br></br>
          <TextField
            required
            id="nom"
            name="nom"
            label="Nom"
            variant="outlined"
            value={Nom}
            onChange={(e) => setNom(e.target.value)}
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
            value={Description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ marginBottom: '16px' }}
          />
          <TextField
            required
            id="prix"
            name="prix"
            label="Prix"
            type="number"
            variant="outlined"
            value={Prix}
            onChange={(e) => setPrix(Number(e.target.value))}
            sx={{ marginBottom: '16px' }}
          />

            <InputLabel id="demo-simple-select-label">Type</InputLabel>
              {menuTypes && (
                  <Select
                  value={Type}
                  id="type"
                  name="type"
                  label="Type"
                  onChange={handleChange}
                  sx={{ mb: 2, width: 'auto' }}
              >
                  {menuTypes.map((type: Types) => (
                  <MenuItem key={type._id} value={type._id}>{type.Name}</MenuItem>
                  ))}
              </Select>
              )}

          <Button type="submit" variant="outlined" color="primary">
            Add Menu
          </Button>
        </Box>
      </FormContainer>
    </OuterContainer>
  );
};

export default AddMenuPage;