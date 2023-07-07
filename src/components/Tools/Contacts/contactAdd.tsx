import React, { useState } from 'react';
import { styled } from '@mui/system';
import { Typography, Box, InputLabel, Button, TextField } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTable } from '@/context/TableContext';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

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

const AddContactPage = () => {
  const [Nom, setNom] = useState("");
  const [Email, setEmail] = useState("");
  const [Sujet, setSujet] = useState("");
  const [Message, setMessage] = useState("");
  const { submitContactForm } = useTable();

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
            Nom: {Nom}
          </UserInfo>
          <UserInfo variant="body1" align="center" sx={{ marginTop: '16px' }}>
            Email: {Email}
          </UserInfo>
          <UserInfo variant="body1" align="center" sx={{ marginTop: '16px' }}>
            Sujet: {Sujet}
          </UserInfo>
          <UserInfo variant="body1" align="center" sx={{ marginTop: '16px' }}>
            Message: {Message}
          </UserInfo>
        </Box>
      </ProfileContainer>
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
        </Box>
      </FormContainer>
    </OuterContainer>
  );
};

export default AddContactPage;