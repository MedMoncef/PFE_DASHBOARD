import React from 'react';
import { styled } from '@mui/system';
import { Typography, Box, Button, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { CldImage } from 'next-cloudinary';

const API_URL_TESTIMONY = 'http://localhost:7000/testimonies';

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
  const [testimonies, setTestimonies] = useState(null);
  const router = useRouter();
  const { testimonyId } = router.query;

  useEffect(() => {
    if (testimonyId) {
      axios.get(`${API_URL_TESTIMONY}/${testimonyId}`).then((res) => {
        setTestimonies(res.data);
      });
    }
  }, [testimonyId]);

  return (
    <OuterContainer>
    {testimonies && (
      <>
      <ProfileContainer key={testimonies._id}>
            <CldImage width="200" height="200" src={`/Users/${testimonies.image}`} alt={testimonies.image}/>
            <UserInfo variant="h4" sx={{ marginTop: '16px' }}>
              {testimonies.name}
            </UserInfo>
            <UserInfo variant="h6">
              {testimonies.title}
            </UserInfo>
            <UserInfo variant="subtitle1">
              {testimonies.comment}
            </UserInfo>
      </ProfileContainer>
        <FormContainer>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', '& .MuiTextField-root': { m: 1, width: '30ch' }, }}>
            <TextField
              required
              id="name"
              name="name"
              label="Name"
              variant="outlined"
              value={testimonies.name}
              sx={{ marginBottom: '16px' }}
            />
            <TextField
              required
              id="title"
              name="title"
              label="Title"
              variant="outlined"
              value={testimonies.title}
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
              value={testimonies.comment}
              sx={{ marginBottom: '16px' }}
            />
            <Button type="submit" variant="outlined" color="primary">
              Modify Testimony
            </Button>
          </Box>
        </FormContainer>
        </>
        )}
      </OuterContainer>  
      );
};

export default TestimonyPage;