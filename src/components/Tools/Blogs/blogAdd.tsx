import React, { useState } from 'react';
import { styled } from '@mui/system';
import { Typography, Box, InputLabel, Button, TextField } from '@mui/material';
import axios from 'axios';
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

const AddBlogPage = () => {
  const [file, setFile] = useState(null);
  const [Titre, setTitle] = useState("");
  const [Content, setContent] = useState("");
  const [Image_B, setImage_B] = useState("");
  const { submitBlogForm } = useTable();

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
          formData.append('public_id', `Blog/${filenameWithoutExtension}`);
          setImage_B(String(file.name));

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
        const BlogFormData = {
          Image_B: imageName,
          Titre,
          Content,
        };

        await submitBlogForm(BlogFormData); // Assuming `add` function adds the blog to the table
        toast.success('Blog added successfully');
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
                Titre: {Titre}
              </UserInfo>
              <UserInfo variant="body1" align="center" sx={{ marginTop: '16px' }}>
                Content: {Content}
              </UserInfo>
            </Box>
          </ProfileContainer>
      <FormContainer>
        <Box component="form" onSubmit={handleAddFormSubmit} sx={{ display: 'flex', flexDirection: 'column', '& .MuiTextField-root': { m: 1, width: '30ch' }, }}>
        
        <InputLabel id="demo-simple-select-label">Upload a Photo</InputLabel>
          <input type="file" onChange={handleFileChange} />
          <br></br>
          <TextField
            required
            id="title"
            name="title"
            label="Title"
            variant="outlined"
            value={Titre}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ marginBottom: '16px' }}
          />
          <TextField
            required
            id="content"
            name="content"
            label="Content"
            variant="outlined"
            multiline
            rows={4}
            value={Content}
            onChange={(e) => setContent(e.target.value)}
            sx={{ marginBottom: '16px' }}
          />

          <Button type="submit" variant="outlined" color="primary">
            Add Blog
          </Button>
        </Box>
      </FormContainer>
    </OuterContainer>
  );
};

export default AddBlogPage;