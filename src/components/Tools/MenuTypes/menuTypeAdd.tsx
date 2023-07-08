import React, { useState } from 'react';
import { styled } from '@mui/system';
import { Box, Button, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import { useTable } from '@/context/TableContext';
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
  background: '#ffffff',
  borderRadius: '10px',
  boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.25)',
});

const AddMenuPage = () => {
  const [Name, setName] = useState("");
  const { submitMenuTypeForm } = useTable();
  const router = useRouter();

  const handleAddFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const contactFormData = {
        Name,
      };

      // Call the submitContactForm function here to handle the form submission
      await submitMenuTypeForm(contactFormData);
      toast.success('Menu added successfully');
      router.push('/Tables/MenuTypes/menuType');
    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error('Something went wrong.');
    }
  };

  const goBackToTable = (e => {
    router.push('/Tables/MenuTypes/menuType');  
  })

  return (
    <OuterContainer
      sx={{
        border: '1px solid #ccc',
        borderRadius: '4px',
      }}
    >
      <ToastContainer />
      <FormContainer>
        <Box component="form" onSubmit={handleAddFormSubmit} sx={{ display: 'flex', flexDirection: 'column', '& .MuiTextField-root': { m: 1, width: '30ch' }, }}>
          <TextField
            required
            id="name"
            name="name"
            label="Name"
            variant="outlined"
            value={Name}
            onChange={(e) => setName(e.target.value)}
            sx={{ marginBottom: '16px' }}
          />

          <Button type="submit" variant="outlined" color="primary">
            Add Menu
          </Button>
          <Button variant="text" color="primary" onClick={goBackToTable}>
            Go back!
          </Button>
        </Box>
      </FormContainer>
    </OuterContainer>
  );
};

export default AddMenuPage;