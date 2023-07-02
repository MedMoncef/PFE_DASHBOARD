import React from 'react';
import { styled } from '@mui/system';
import { Typography, Box, Button, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const API_URL_WORK_POST = 'http://localhost:7000/posts';

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

const WorkPostPage = () => {
  const [workPost, setWorkPost] = useState(null);
  const router = useRouter();
  const { workPId } = router.query;

  useEffect(() => {
    if (workPId) {
      axios.get(`${API_URL_WORK_POST}/${workPId}`).then((res) => {
        setWorkPost(res.data);
      });
    }
  }, [workPId]);

  return (
    <OuterContainer             
      sx={{
        border: '1px solid #ccc',
        borderRadius: '4px',
      }}
    >
      {workPost && (
        <>
          <ProfileContainer>
            <Box
              key={workPost._id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '32px',
                marginBottom: '32px'
              }}
            >
              <UserInfo variant="h4" align="center" sx={{ marginTop: '16px' }}>
                Name: {workPost.Name}
              </UserInfo>
              <UserInfo variant="h4" align="center" sx={{ marginTop: '16px' }}>
                Salaire: {workPost.Salaire}
              </UserInfo>
            </Box>
          </ProfileContainer>
          <FormContainer>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', '& .MuiTextField-root': { m: 1, width: '30ch' }, }}>
              <TextField
                required
                id="name"
                name="name"
                label="Name"
                variant="outlined"
                value={workPost.Name}
                sx={{ marginBottom: '16px' }}
              />
              <TextField
                required
                id="salaire"
                name="salaire"
                label="Salaire"
                variant="outlined"
                type="number"
                value={workPost.Salaire}
                sx={{ marginBottom: '16px' }}
              />
              <Button type="submit" variant="outlined" color="primary">
                Modify Work Post
              </Button>
            </Box>
          </FormContainer>
        </>
      )}
    </OuterContainer>  
  );
};

export default WorkPostPage;