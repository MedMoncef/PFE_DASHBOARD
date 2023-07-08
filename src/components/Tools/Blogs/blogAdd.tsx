import React, { useState } from 'react';
import { styled } from '@mui/system';
import { Typography, Box, InputLabel, Button, TextField, Card, CardContent, Grid, CardActions } from '@mui/material';
import axios from 'axios';
import { useTable } from '@/context/TableContext';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useRouter } from 'next/router';
import { CldImage } from 'next-cloudinary';
import { toast } from 'react-toastify';

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

const AddBlogPage = () => {
  const [file, setFile] = useState(null);
  const [Titre, setTitle] = useState("");
  const [Content, setContent] = useState("");
  const [Image_B, setImage_B] = useState("");
  const { submitBlogForm } = useTable();
  const router = useRouter();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const goBackToTable = (e => {
    router.push('/Tables/Blogs/blog');  
  })

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
        router.push('/Tables/Blogs/blog');
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
          <ProfileContainer>

            <Grid container spacing={2} style={{ margin: '2% 0', display: 'flex', justifyContent: 'center' }}>
                <Card sx={{ maxWidth: 350, margin: '2% 2%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <CldImage width="400" height="250" src={`/Blog/${Image_B}`} alt={Image_B}/>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Titre: {Titre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Content: {Content}
                    </Typography>
                  </CardContent>
                  <CardActions style={{ marginTop: 'auto' }}>
                  </CardActions>
                </Card>
            </Grid>

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
          <Button variant="text" color="primary" onClick={goBackToTable}>
             Go back!
          </Button>
        </Box>
      </FormContainer>
    </OuterContainer>
  );
};

export default AddBlogPage;