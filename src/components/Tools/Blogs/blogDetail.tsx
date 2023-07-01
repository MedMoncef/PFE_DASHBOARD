import React from 'react';
import { styled } from '@mui/system';
import { Typography, Box, Avatar, Button, TextField, InputLabel } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { CldImage } from 'next-cloudinary';

const API_URL_BLOG = 'http://localhost:7000/blogs';

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

const UserAvatar = styled(Avatar)({
  width: '200px',
  height: '200px',
  marginBottom: '16px',
});

const UserInfo = styled(Typography)({
  textAlign: 'center',
});

const BlogPage = () => {
  const [blog, setBlog] = useState(null);
  const router = useRouter();
  const { blogId } = router.query;

  useEffect(() => {
    if (blogId) {
      axios.get(`${API_URL_BLOG}/${blogId}`).then((res) => {
        setBlog(res.data);
      });
    }
  }, [blogId]);

  return (
    <OuterContainer             
      sx={{
        border: '1px solid #ccc',
        borderRadius: '4px',
      }}
    >
      {blog && (
        <>
          <ProfileContainer>
            <Box
              key={blog._id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '32px',
                marginBottom: '32px'
              }}
            >
              <CldImage width="500" height="500" src={`/Blog/${blog.Image}`} alt={blog.Image}/>
              <UserInfo variant="h4" align="center" sx={{ marginTop: '16px' }}>
                {blog.Titre}
              </UserInfo>
              <UserInfo variant="body1" align="center" sx={{ marginTop: '16px' }}>
                {blog.Content}
              </UserInfo>
              <UserInfo variant="body2" align="center" sx={{ marginTop: '16px' }}>
                {new Date(blog.DateU).toLocaleDateString()}
              </UserInfo>
            </Box>
          </ProfileContainer>
          <FormContainer>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', '& .MuiTextField-root': { m: 1, width: '30ch' }, }}>
              <TextField
                required
                id="title"
                name="title"
                label="Title"
                variant="outlined"
                value={blog.Titre}
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
                value={blog.Content}
                sx={{ marginBottom: '16px' }}
              />
              <TextField
                required
                id="date"
                name="date"
                label="Date"
                variant="outlined"
                value={new Date(blog.DateU).toLocaleDateString()}
                sx={{ marginBottom: '16px' }}
              />
              <InputLabel id="demo-simple-select-label">Image</InputLabel>
              <TextField
                required
                id="image"
                name="image"
                type="File"
                sx={{ marginBottom: '16px' }}
              />
              <Button type="submit" variant="outlined" color="primary">
                Modify Blog
              </Button>
            </Box>
          </FormContainer>
        </>
      )}
    </OuterContainer>  
  );
};

export default BlogPage;