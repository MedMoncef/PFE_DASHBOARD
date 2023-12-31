import React from 'react';
import { styled } from '@mui/system';
import { Typography, Box, Button, TextField, InputLabel, Grid, Card, CardContent } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { CldImage } from 'next-cloudinary';
import { useTable } from '@/context/TableContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

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

const TestimonyPage = () => {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const { submitTestimonyForm } = useTable();
  const [image, setImage] = useState("");
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");

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
          formData.append('public_id', `Users/${filenameWithoutExtension}`);
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
        const testimonyData = {
          comment: comment,
          name: name,
          image: imageName,
          title: title,
        };
  
        await submitTestimonyForm(testimonyData);
        toast.success('Testimony added successfully');
        router.push('/Tables/Testimonies/testimony');
      } else {
        throw new Error('Image upload failed');
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error('Something went wrong.');
    }
  };  

  return (
    <OuterContainer>
      <ToastContainer />
      <ProfileContainer>

            <Grid container spacing={2} style={{ margin: '2% 0', display: 'flex', justifyContent: 'center' }}>
              <Card sx={{ maxWidth: 350, margin: '2% 2%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <CldImage width="400" height="250" src={`/Users/${image}`} alt={image}/>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Name: {name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Title: {title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Comment: {comment}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

      </ProfileContainer>
        <FormContainer>
        <Box component="form" onSubmit={handleFormSubmit} sx={{ display: 'flex', flexDirection: 'column', '& .MuiTextField-root': { m: 1, width: '30ch' }, }}>
            
            <InputLabel id="demo-simple-select-label">Image</InputLabel>
            <input type="file" onChange={handleFileChange} />

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
              id="title"
              name="title"
              label="Title"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ marginBottom: '16px' }}
            />
            <TextField
              required
              id="comment"
              name="comment"
              label="Comment"
              variant="outlined"
              multiline
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{ marginBottom: '16px' }}
            />
            <Button type="submit" variant="outlined" color="primary">
              Modify Testimony
            </Button>
            <Grid item xs={12}>
              <Button fullWidth variant="text" onClick={() => router.push('/Tables/Testimonies/testimony')}>
                Go back 
              </Button>
            </Grid>

          </Box>
        </FormContainer>
      </OuterContainer>  
      );
};

export default TestimonyPage;