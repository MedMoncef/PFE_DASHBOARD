import React, { useState } from 'react';
import { styled } from '@mui/system';
import { Typography, Box, Button, TextField } from '@mui/material';
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

const AddContactPage = () => {
  const [Nom, setNom] = useState("");
  const [Email, setEmail] = useState("");
  const [Sujet, setSujet] = useState("");
  const [Message, setMessage] = useState("");
  const { submitContactForm } = useTable();
  const router = useRouter();

  const handleAddFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const contactFormData = {
        Nom,
        Email,
        Sujet,
        Message,
      };

      // Call the submitContactForm function here to handle the form submission
      await submitContactForm(contactFormData);
      toast.success('Contact added successfully');
      router.push('/Tables/Contacts/contact');
    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error('Something went wrong.');
    }
  };

  const goBackToTable = (e => {
    router.push('/Tables/Contacts/contact');  
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
            id="nom"
            name="nom"
            label="Nom"
            variant="outlined"
            value={Nom}
            onChange={(e) => setNom(e.target.value)}
            sx={{ marginBottom: '16px' }}
          />
          <TextField
            required
            id="email"
            name="email"
            label="Email"
            variant="outlined"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ marginBottom: '16px' }}
          />
          <TextField
            required
            id="sujet"
            name="sujet"
            label="Sujet"
            variant="outlined"
            value={Sujet}
            onChange={(e) => setSujet(e.target.value)}
            sx={{ marginBottom: '16px' }}
          />
          <TextField
            required
            id="message"
            name="message"
            label="Message"
            variant="outlined"
            multiline
            rows={4}
            value={Message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{ marginBottom: '16px' }}
          />

          <Button type="submit" variant="outlined" color="primary">
            Add Contact
          </Button>
          <Button variant="text" color="primary" onClick={goBackToTable}>
            Go back!
          </Button>
        </Box>
      </FormContainer>
    </OuterContainer>
  );
};

export default AddContactPage;