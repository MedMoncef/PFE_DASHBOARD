import React from 'react';
import Link from 'next/link';
import { styled } from '@mui/system';
import { TextField, Typography, Button, Box, Avatar, FormControl, InputLabel, MenuItem } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { CldImage } from 'next-cloudinary';
import { useTable } from '@/context/TableContext';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import jwt_decode from 'jwt-decode';

const API_URL_USER = 'http://localhost:7000/users';
const API_URL_POST = 'http://localhost:7000/posts';

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

const ProfilePage = () => {
    const router = useRouter();
    const [userDetail, setUserDetails] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [file, setFile] = useState(null);
    const { updateById } = useTable();

    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [dateN, setDateN] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState("");
    const [id_post, setIdPost] = useState("");
    const { isLoggedIn } = useAuth();
    const [profileID, setProfileID] = useState("");
    const [oldImage, setOldImage] = useState("");

    useEffect(() => {
      if(isLoggedIn) {
        const token = localStorage.getItem('token');
        const decodedToken = jwt_decode(token);
        setProfileID(decodedToken.user_id);
      }
    }, [isLoggedIn]);


    useEffect(() => {
        if (profileID) {
          axios.get(`${API_URL_USER}/${profileID}`).then((res) => {
            setUserDetails(res.data);
            setNom(res.data.nom);
            setPrenom(res.data.prenom);
            setDateN(res.data.dateN);
            setEmail(res.data.email);
            setPassword(res.data.password);
            setIdPost(res.data.id_post);
            setOldImage(res.data.image);
          });
        }
      }, [profileID]);

      const fetchData = async () => {
        const result = await axios(API_URL_POST);
        setUserPosts(result.data);
      };
      
      useEffect(() => {
        fetchData();
      }, []);

      const handleChange = (event: SelectChangeEvent) => {
        setIdPost(event.target.value as string);
      };

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
              formData.append('public_id', `Users/${filenameWithoutExtension}`);
      
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
          }else{
            imageName = oldImage;
          }
      
          if (imageName || imageName === '') {
            const userData = {
              nom: nom,
              prenom: prenom,
              dateN: dateN,
              email: email,
              password: password,
              image: imageName,
              id_post: id_post
            };

            console.log(userData);
      
            await updateById("users", profileID, userData);
            toast.success('User updated successfully');
          } else {
            throw new Error('Image upload failed');
          }
        } catch (error) {
          console.error('Error in form submission:', error);
          toast.error('Something went wrong.');
        }
      };
      
    return (
        <>
        {userDetail && (
            <OuterContainer>
                <ProfileContainer>
                      <CldImage width="250" height="250" src={`/Users/${userDetail.image}`} alt={userDetail.image}/>

                      <UserInfo variant="h4">
                        {userDetail.nom}
                    </UserInfo>
                    <UserInfo variant="h4">
                        {userDetail.prenom}
                    </UserInfo>
                    <UserInfo variant="subtitle1">
                        Date of Birth: {userDetail.dateN}
                    </UserInfo>
                    <UserInfo variant="subtitle1">
                        Email: {userDetail.email}
                    </UserInfo>
                    <UserInfo variant="subtitle1">
                        Role: {userDetail.id_post.Name}
                    </UserInfo>
                </ProfileContainer>
                <FormContainer>
                <Box component="form" onSubmit={handleFormSubmit} sx={{ display: 'flex', flexDirection: 'column', '& .MuiTextField-root': { m: 1, width: '30ch' }, }}>
                        <TextField required id="firstName" label="First Name" variant="outlined" value={nom} onChange={(e) => setNom(e.target.value)}/>
                        <TextField required id="lastName" label="Last Name" variant="outlined" value={prenom} onChange={(e) => setPrenom(e.target.value)}/>
                        <TextField required id="dateOfBirth" label="Date of Birth" variant="outlined" value={dateN} onChange={(e) => setDateN(e.target.value)}/>
                        <TextField required id="email" label="Email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)}/>
                        <TextField required id="password" label="Password" variant="outlined" type="password" onChange={(e) => setPassword(e.target.value)}/>
                
                          <InputLabel id="demo-simple-select-label">Image</InputLabel>
                          <input type="file" onChange={handleFileChange} />

                        <Button type="submit" variant="outlined" color="primary" style={{ marginTop: '20px' }}>
                            Modify
                        </Button>
                    </Box>
                </FormContainer>
            </OuterContainer>
        )}

            <style>
            {`
              .image-preview {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid #ccc;
              }
            `}
          </style>
        </>
    );
};

export default ProfilePage;