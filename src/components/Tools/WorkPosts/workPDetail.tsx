import React, { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import { Typography, Box, Button, TextField } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const API_URL_WORK_POST = 'http://localhost:7000/posts';
const API_URL_WORK_POST_UPDATE = 'http://localhost:7000/update_post';

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
  background: '#ffffff',
  borderRadius: '10px',
  boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.25)',
});

const WorkPostPage = () => {
  const [workPost, setWorkPost] = useState(null);
  const [modifiedWorkPost, setModifiedWorkPost] = useState({
    Name: '',
    Salaire: 0,
  });
  const router = useRouter();
  const { workPId } = router.query;

  useEffect(() => {
    if (workPId) {
      axios.get(`${API_URL_WORK_POST}/${workPId}`).then((res) => {
        setWorkPost(res.data);
        setModifiedWorkPost(res.data);
      });
    }
  }, [workPId]);

  const handleInputChange = (e) => {
    setModifiedWorkPost({
      ...modifiedWorkPost,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.put(`${API_URL_WORK_POST_UPDATE}/${workPId}`, modifiedWorkPost);
      setWorkPost(modifiedWorkPost);
      toast.success('Work post updated successfully');
      router.push('/Tables/WorkPosts/workPost');
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };

  const goBackToTable = (e => {
    router.push('/Tables/WorkPosts/workPost');  
  })

  return (
    <OuterContainer
      sx={{
        border: '1px solid #ccc',
        borderRadius: '4px',
      }}
    >
      <ToastContainer />
      {workPost && (
        <>
          <FormContainer>
            <Box
              component="form"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                '& .MuiTextField-root': { m: 1, width: '30ch' },
              }}
              onSubmit={handleFormSubmit}
            >
              <TextField
                required
                id="name"
                name="Name"
                label="Name"
                variant="outlined"
                value={modifiedWorkPost.Name}
                sx={{ marginBottom: '16px' }}
                onChange={handleInputChange}
              />
              <TextField
                required
                id="salaire"
                name="Salaire"
                label="Salaire"
                variant="outlined"
                type="number"
                value={modifiedWorkPost.Salaire}
                sx={{ marginBottom: '16px' }}
                onChange={handleInputChange}
              />
              <Button type="submit" variant="outlined" color="primary">
                Modify Work Post
              </Button>
              <Button variant="text" color="primary" onClick={goBackToTable}>
                Go back!
              </Button>
            </Box>
          </FormContainer>
        </>
      )}
    </OuterContainer>
  );
};

export default WorkPostPage;