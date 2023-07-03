import React, { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import { Typography, Box, Button, TextField } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';

const API_URL_MENU_TYPE = 'http://localhost:7000/menuTypes';

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

const MenuTypePage = () => {
  const [menuType, setMenuType] = useState(null);
  const [modifiedMenuType, setModifiedMenuType] = useState({
    Name: '',
  });
  const router = useRouter();
  const { menuTypeId } = router.query;

  useEffect(() => {
    if (menuTypeId) {
      axios.get(`${API_URL_MENU_TYPE}/${menuTypeId}`).then((res) => {
        setMenuType(res.data);
        setModifiedMenuType(res.data);
      });
    }
  }, [menuTypeId]);

  const handleInputChange = (e) => {
    setModifiedMenuType({
      ...modifiedMenuType,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.put(`${API_URL_MENU_TYPE}/${menuTypeId}`, modifiedMenuType);
      setMenuType(modifiedMenuType);
      console.log('Menu type updated successfully');
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
      {menuType && (
        <>
          <ProfileContainer>
            <Box
              key={menuType._id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '32px',
                marginBottom: '32px',
              }}
            >
              <UserInfo variant="h4" align="center" sx={{ marginTop: '16px' }}>
                {menuType.Name}
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
                id="name"
                name="Name"
                label="Name"
                variant="outlined"
                value={modifiedMenuType.Name}
                sx={{ marginBottom: '16px' }}
                onChange={handleInputChange}
              />
              <Button type="submit" variant="outlined" color="primary">
                Modify Menu Type
              </Button>
            </Box>
          </FormContainer>
        </>
      )}
    </OuterContainer>
  );
};

export default MenuTypePage;