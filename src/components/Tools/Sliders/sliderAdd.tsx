import React from 'react';
import { styled } from '@mui/system';
import { Typography, Box, InputLabel, Button, TextField, Grid } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { CldImage } from 'next-cloudinary';
import { useTable } from '@/context/TableContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useRouter } from 'next/router';

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

const AddSliderPage = () => {
  const [slider, setSlider] = useState(null);
  const [file, setFile] = useState(null);
  const { submitSliderForm } = useTable();
  const [image, setImage] = useState("");
  const [titre, setTitre] = useState("");
  const [text, setText] = useState("");
  const router = useRouter();

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
          formData.append('public_id', `Background/${filenameWithoutExtension}`);
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
        const sliderData = {
          Image: imageName,
          Titre: titre,
          Text: text,
        };
  
        await submitSliderForm(sliderData);
        toast.success('Slider Added successfully');
        router.push('/Tables/Sliders/slider');
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
      <ToastContainer />
        <>
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
              <CldImage width="300" height="300" src={`/Background/${image}`} alt={image}/>
              <UserInfo variant="h4" align="center" sx={{ marginTop: '16px' }}>
                Titre: {titre}
              </UserInfo>
              <UserInfo variant="body1" align="center" sx={{ marginTop: '16px' }}>
                Text: {text}
              </UserInfo>
            </Box>
          </ProfileContainer>
          <FormContainer>
            <Box component="form" onSubmit={handleFormSubmit} sx={{ display: 'flex', flexDirection: 'column', '& .MuiTextField-root': { m: 1, width: '30ch' }, }}>

                <InputLabel id="demo-simple-select-label">Image</InputLabel>
                <input type="file" onChange={handleFileChange} />

              <TextField
                required
                id="title"
                name="title"
                label="Title"
                variant="outlined"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                sx={{ marginBottom: '16px' }}
              />
              <TextField
                required
                id="text"
                name="text"
                label="Text"
                variant="outlined"
                multiline
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                sx={{ marginBottom: '16px' }}
              />
              <Button type="submit" variant="outlined" color="primary">
                Add Slider
              </Button>
              <Grid item xs={12}>
                <Button fullWidth variant="text" onClick={() => router.push('/Tables/Sliders/slider')}>
                  Go back
                </Button>
              </Grid>

            </Box>
          </FormContainer>
        </>
    </OuterContainer>  
  );
};

export default AddSliderPage;