import React, { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import { Typography, Box, Button, TextField, InputLabel, MenuItem, Card, CardContent, Grid } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTable } from '@/context/TableContext';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useRouter } from 'next/router';
import { CldImage } from 'next-cloudinary';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const API_URL_MENUTYPE = 'http://localhost:7000/menuTypes';

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

const AddMenuPage = () => {
  const [file, setFile] = useState(null);
  const [Image, setImage] = useState("");
  const [Nom, setNom] = useState("");
  const [Description, setDescription] = useState("");
  const [Prix, setPrix] = useState(0);
  const [Type, setType] = useState("");
  const { submitMenuForm } = useTable();
  const [menuTypes, setMenuTypes] = useState(null);
  const router = useRouter();

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

  const handleAddFormSubmit = async (event) => {
    event.preventDefault();

    try {
      let imageName = '';
      if (file) {
        imageName = await uploadImage();
      }

      if (imageName || imageName === '') {
        const menuFormData = {
          Image: imageName,
          Nom,
          Description,
          Prix,
          Type,
        };

        await submitMenuForm(menuFormData);
        toast.success('Menu added successfully');
        router.push('/Tables/Menus/menu');
      } else {
        throw new Error('Image upload failed');
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error('Something went wrong.');
    }
  };

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

  const goBackToTable = (e => {
    router.push('/Tables/Menus/menu');  
  })

  return (
    <OuterContainer
      sx={{
        border: '1px solid #ccc',
        borderRadius: '4px',
      }}
    >
      <ToastContainer />
      <ProfileContainer>

            <Grid container spacing={2} style={{ margin: '2% 0', display: 'flex', justifyContent: 'center' }}>
              <Card sx={{ maxWidth: 350, margin: '2% 2%' }} style={{ alignSelf: 'flex' }}>
              <CldImage width="350" height="250" src={`/Menu/${Image}`} alt={Image}/>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <CardContent sx={{ flex: '1 0 auto' }}>
                      <Typography component="div" variant="h5">
                          {Nom}
                          <div style={{ display: 'flex', width: '80px', color: '#2f89fc', textAlign: 'right', fontSize: '20px', fontWeight: '600' }}>
                          $ {Prix}
                          </div>
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary" component="div">
                          {Description}
                      </Typography>
                      </CardContent>
                  </Box>
              </Card>
            </Grid>

      </ProfileContainer>
      <FormContainer>
        <Box
          component="form"
          onSubmit={handleAddFormSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            '& .MuiTextField-root': { m: 1, width: '30ch' },
          }}
        >
          <InputLabel id="demo-simple-select-label">Upload an Image</InputLabel>
          <input type="file" onChange={handleFileChange} />
          <br></br>
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
            id="description"
            name="description"
            label="Description"
            variant="outlined"
            multiline
            rows={4}
            value={Description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ marginBottom: '16px' }}
          />
          <TextField
            required
            id="prix"
            name="prix"
            label="Prix"
            type="number"
            variant="outlined"
            value={Prix}
            onChange={(e) => setPrix(Number(e.target.value))}
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