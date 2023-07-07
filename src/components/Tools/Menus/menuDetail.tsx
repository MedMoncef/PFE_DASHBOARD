import React from 'react';
import { styled } from '@mui/system';
import { Typography, Box, Avatar, Button, TextField, InputLabel, MenuItem } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { CldImage } from 'next-cloudinary';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useTable } from '@/context/TableContext';
import { toast } from 'react-toastify';

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
  const [menuTypes, setMenuTypes] = useState(null);
  const [file, setFile] = useState(null);
  const [Nom, setNom] = useState("");
  const [Description, setDescription] = useState("");
  const [Image, setImage] = useState("");
  const [Prix, setPrix] = useState("");
  const [Type, setType] = useState("");
  const { updateById } = useTable();

  useEffect(() => {
    if (menuId) {
      axios.get(`${API_URL_MENU}/${menuId}`).then((res) => {
        setMenu(res.data);
        setNom(res.data.Nom);
        setDescription(res.data.Description);
        setPrix(res.data.Prix);
        setType(res.data.Type.Name);
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
    setType(event.target.value as string);
  };

  interface Types {
    _id: string;
    Name: string;
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };
  
  const uploadImage = async (): Promise<string> => {
    return new Promise<string>(async (resolve, reject) => {
      if (file) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', 'HarborHotel');
          const filenameWithoutExtension = file.name.replace(/\.[^/.]+$/, ""); // Remove file extension
          formData.append('public_id', `Menu/${filenameWithoutExtension}`);
          setImage(String(file.name));
  
          await axios.post('https://api.cloudinary.com/v1_1/dv5o7w2aw/upload', formData);
  
          // Handle the response or perform additional operations
          console.log('File uploaded successfully');
  
          resolve(file.name); // Return file name
        } catch (error) {
          console.error('Error uploading file:', error);
          reject(error);
        }
      } else {
        resolve('');
      }
    });
  };
  
  const handleFormSubmit = async (event) => {
    event.preventDefault();
  
    try {
      let imageName = '';
      if (file) {
        imageName = await uploadImage();
      }
  
      if (imageName || imageName === '') {
        const menuData = {
          Image: imageName,  // Use imageName instead of imageUrl
          Nom,
          Description,
          Prix,
          Type,
        };
  
        await updateById("menus", menuId, menuData);
        toast.success('Menu updated successfully');
      } else {
        throw new Error('Image upload failed');
      }
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
              <UserInfo variant="h6" align="center" sx={{ marginTop: '16px' }}>
                {menu.Description}
              </UserInfo>
              <UserInfo variant="h6" align="center" sx={{ marginTop: '16px' }}>
                Prix: {menu.Prix} $
              </UserInfo>
              <UserInfo variant="h6" align="center" sx={{ marginTop: '16px' }}>
                Type: {menu.Type.Name}
              </UserInfo>
            </Box>
          </ProfileContainer>
          <FormContainer>
            <Box component="form" onSubmit={handleFormSubmit} sx={{ display: 'flex', flexDirection: 'column', '& .MuiTextField-root': { m: 1, width: '30ch' }, }}>
            <InputLabel id="demo-simple-select-label">Image</InputLabel>
              <input type="file" onChange={handleFileChange} />

              <TextField
                required
                id="nom"
                name="nom"
                label="Nom"
                variant="outlined"
                value={Nom} // Use Nom state variable instead of menu.Nom
                onChange={(e) => setNom(e.target.value)}
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
                value={Description} // Use Description state variable instead of menu.Description
                onChange={(e) => setDescription(e.target.value)}
                sx={{ marginBottom: '16px' }}
              />

              <TextField
                required
                id="prix"
                name="prix"
                label="Prix"
                variant="outlined"
                type="number"
                value={Prix} // Use Prix state variable instead of menu.Prix
                onChange={(e) => setPrix(e.target.value)}
                sx={{ marginBottom: '16px' }}
              />
              <InputLabel id="demo-simple-select-label">Type</InputLabel>
              {menuTypes && (
                  <Select
                  value={Type}
                  id="type"
                  name="type"
                  label="Type"
                  onChange={handleChange}
                  sx={{ mb: 2, width: 'auto' }}
              >
                  {menuTypes.map((type: Types) => (
                  <MenuItem key={type._id} value={type._id}>{type.Name}</MenuItem>
                  ))}
              </Select>
              )}
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