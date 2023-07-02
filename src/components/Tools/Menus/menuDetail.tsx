import React from 'react';
import { styled } from '@mui/system';
import { Typography, Box, Avatar, Button, TextField, InputLabel, MenuItem } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { CldImage } from 'next-cloudinary';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const API_URL_MENU = 'http://localhost:7000/menus';
const API_URL_MENUTYPE = 'http://localhost:7000/menuTypes';

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

const MenuPage = () => {
  const [menu, setMenu] = useState(null);
  const router = useRouter();
  const { menuId } = router.query;
  const [selectedTypes, setSelectedTypes] = useState("");
  const [menuTypes, setMenuTypes] = useState(null);

  useEffect(() => {
    if (menuId) {
      axios.get(`${API_URL_MENU}/${menuId}`).then((res) => {
        setMenu(res.data);
      });
    }
    console.log(router.query);
  }, [menuId]);

  const fetchData = async () => {
    const result = await axios(API_URL_MENUTYPE);
    setMenuTypes(result.data);
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedTypes(event.target.value as string);
  };

  interface Types {
    _id: string;
    Name: string;
  }

  return (
    <OuterContainer             
      sx={{
        border: '1px solid #ccc',
        borderRadius: '4px',
      }}
    >
      {menu && (
        <>
          <ProfileContainer>
            <Box
              key={menu._id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '32px',
                marginBottom: '32px'
              }}
            >
              <CldImage width="500" height="500" src={`/Menu/${menu.Image}`} alt={menu.Image}/>
              <UserInfo variant="h4" align="center" sx={{ marginTop: '16px' }}>
                {menu.Nom}
              </UserInfo>
              <UserInfo variant="body1" align="center" sx={{ marginTop: '16px' }}>
                {menu.Description}
              </UserInfo>
              <UserInfo variant="body2" align="center" sx={{ marginTop: '16px' }}>
                Prix: {menu.Prix} $
              </UserInfo>
              <UserInfo variant="body2" align="center" sx={{ marginTop: '16px' }}>
                Type: {menu.Type.Name}
              </UserInfo>
            </Box>
          </ProfileContainer>
          <FormContainer>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', '& .MuiTextField-root': { m: 1, width: '30ch' }, }}>
              <TextField
                required
                id="image"
                name="image"
                label="Image"
                variant="outlined"
                value={menu.Image}
                sx={{ marginBottom: '16px' }}
              />
              <TextField
                required
                id="nom"
                name="nom"
                label="Nom"
                variant="outlined"
                value={menu.Nom}
                sx={{ marginBottom: '16px' }}
              />
              <TextField
                required
                id="description"
                name="description"
                label="Description"
                variant="outlined"
                multiline
                rows={4}
                value={menu.Description}
                sx={{ marginBottom: '16px' }}
              />
              <TextField
                required
                id="prix"
                name="prix"
                label="Prix"
                variant="outlined"
                type="number"
                value={menu.Prix}
                sx={{ marginBottom: '16px' }}
              />
              <InputLabel id="demo-simple-select-label">Role</InputLabel>
              {menuTypes && (
                  <Select
                  value={selectedTypes}
                  label="Role"
                  onChange={handleChange}
                  sx={{ mb: 2, width: 'auto' }}
              >
                  {menuTypes.map((type: Types) => (
                  <MenuItem key={type._id} value={type._id}>{type.Name}</MenuItem>
                  ))}
              </Select>
              )}
              <TextField
                required
                id="type"
                name="type"
                label="Type"
                variant="outlined"
                value={menu.Type.Name}
                sx={{ marginBottom: '16px' }}
              />
              <Button type="submit" variant="outlined" color="primary">
                Modify Menu
              </Button>
            </Box>
          </FormContainer>
        </>
      )}
    </OuterContainer>  
  );
};

export default MenuPage;