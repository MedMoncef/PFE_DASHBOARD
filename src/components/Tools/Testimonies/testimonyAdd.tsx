import React from 'react';
import { styled } from '@mui/system';
import { Typography, Box, Button, TextField, InputLabel } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { CldImage } from 'next-cloudinary';
import { useTable } from '@/context/TableContext';
import { toast } from 'react-toastify';

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
      <>
      <ProfileContainer>
            <CldImage width="200" height="200" src={`/Users/${image}`} alt={image}/>
            <UserInfo variant="h4" sx={{ marginTop: '16px' }}>
              Name: {name}
            </UserInfo>
            <UserInfo variant="h6">
              Title: {title}
            </UserInfo>
            <UserInfo variant="subtitle1">
              Title: {comment}
            </UserInfo>
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
          </Box>
        </FormContainer>
        </>
      </OuterContainer>  
      );
};

export default TestimonyPage;