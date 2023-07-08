import React, { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import { Typography, Box, Button, TextField } from '@mui/material';
import { useRouter } from 'next/router';
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
  background: '#ffffff',
  borderRadius: '10px',
  boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.25)',
});

const WorkPostAddPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [salaire, setSalaire] = useState("");
  const { submitPostForm } = useTable();

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const postFormData = {
        Name: name,
        Salaire: Number(salaire),
      };
      
      submitPostForm(postFormData);
      toast.success('Work post added successfully');
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ marginBottom: '16px' }}
              />
              <TextField
                required
                id="salaire"
                name="Salaire"
                label="Salaire"
                variant="outlined"
                type="number"
                value={salaire}
                onChange={(e) => setSalaire(e.target.value)}
                sx={{ marginBottom: '16px' }}
              />
              <Button type="submit" variant="outlined" color="primary">
                Add Work Post
              </Button>
              <Button variant="text" color="primary" onClick={goBackToTable}>
                Go back!
              </Button>
            </Box>
          </FormContainer>
        </>
    </OuterContainer>
  );
};

export default WorkPostAddPage;