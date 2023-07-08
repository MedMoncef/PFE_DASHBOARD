import React, { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import { Box, Button, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';

const API_URL_CONTACT = 'http://localhost:7000/contacts';

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

const ContactPage = () => {
  const [contact, setContact] = useState(null);
  const [modifiedContact, setModifiedContact] = useState({
    Nom: '',
    Email: '',
    Sujet: '',
    Message: '',
  });
  const router = useRouter();
  const { contactId } = router.query;

  useEffect(() => {
    if (contactId) {
      axios.get(`${API_URL_CONTACT}/${contactId}`).then((res) => {
        setContact(res.data);
        setModifiedContact(res.data);
      });
    }
  }, [contactId]);

  const handleInputChange = (e) => {
    setModifiedContact({
      ...modifiedContact,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.put(`${API_URL_CONTACT}/${contactId}`, modifiedContact);
      setContact(modifiedContact);
      toast.success('Contact Modified successfully');
      router.push('/Tables/Contacts/contact');
    } catch (error) {
      console.error('Error in form submission:', error);
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
      {contact && (
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
                id="nom"
                name="Nom"
                label="Nom"
                variant="outlined"
                value={modifiedContact.Nom}
                sx={{ marginBottom: '16px' }}
                onChange={handleInputChange}
              />
              <TextField
                required
                id="email"
                name="Email"
                label="Email"
                variant="outlined"
                value={modifiedContact.Email}
                sx={{ marginBottom: '16px' }}
                onChange={handleInputChange}
              />
              <TextField
                required
                id="sujet"
                name="Sujet"
                label="Sujet"
                variant="outlined"
                value={modifiedContact.Sujet}
                sx={{ marginBottom: '16px' }}
                onChange={handleInputChange}
              />
              <TextField
                required
                id="message"
                name="Message"
                label="Message"
                variant="outlined"
                multiline
                rows={4}
                value={modifiedContact.Message}
                sx={{ marginBottom: '16px' }}
                onChange={handleInputChange}
              />
              <Button type="submit" variant="outlined" color="primary">
                Modify contact
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

export default ContactPage;