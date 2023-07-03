import React, { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import { Typography, Box, Button, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import axios from 'axios';

const API_URL_CONTACT = 'http://localhost:7000/contacts';

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
  minHeight: '50%',
  boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.25)',
  background: '#ffffff',
  color: 'black',
  borderRadius: '10px',
});

const UserInfo = styled(Typography)({
  textAlign: 'left',
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
      console.log('Contact updated successfully');
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };

  return (
    <OuterContainer
      sx={{
        border: '1px solid #ccc',
        borderRadius: '4px',
      }}
    >
      {contact && (
        <>
          <ProfileContainer>
            <Box
              key={contact._id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '32px',
                marginBottom: '32px',
              }}
            >
              <UserInfo variant="h4" align="center" sx={{ marginTop: '16px' }}>
                {contact.Nom}
              </UserInfo>
              <UserInfo variant="h6" align="center" sx={{ marginTop: '16px' }}>
                {contact.Email}
              </UserInfo>
              <UserInfo variant="h6" align="center" sx={{ marginTop: '16px' }}>
                {contact.Sujet}
              </UserInfo>
              <UserInfo variant="h6" align="center" sx={{ marginTop: '16px' }}>
                {contact.Message}
              </UserInfo>
            </Box>
          </ProfileContainer>
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
            </Box>
          </FormContainer>
        </>
      )}
    </OuterContainer>
  );
};

export default ContactPage;