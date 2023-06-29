import React from 'react';
import Link from 'next/link';
import { styled } from '@mui/system';
import { TextField, Typography, Button, Box, Avatar, FormControl, InputLabel, MenuItem } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Select, { SelectChangeEvent } from '@mui/material/Select';


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
    minHeight: '100vh',
});

const UserAvatar = styled(Avatar)({
    width: '200px',
    height: '200px',
    marginBottom: '16px',
});

const UserInfo = styled(Typography)({
    textAlign: 'center',
});

const ProfilePage = () => {
    const router = useRouter();
    const { userId } = router.query;
    const [userDetail, setUserDetails] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState("");

    useEffect(() => {
        if (userId) {
          axios.get(`${API_URL_USER}/${userId}`).then((res) => {
            setUserDetails(res.data);
          });
        }
      }, [userId]);

      const fetchData = async () => {
        const result = await axios(API_URL_POST);
        setUserPosts(result.data);
      };
      
      useEffect(() => {
        fetchData();
      }, []);

      const handleChange = (event: SelectChangeEvent) => {
        setSelectedPost(event.target.value as string);
      };
      
      interface Roles {
        _id: string;
        Name: string;
        Salaire: Number;
      }

    return (
        <>
        {userDetail && (
            <OuterContainer>
                <ProfileContainer>
                    <UserAvatar src={userDetail.Image} />
                    <UserInfo variant="h4">
                        {userDetail.nom} {userDetail.prenom}
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
                    <Link href="/edit-profile" passHref>
                        <Button variant="contained" color="primary" style={{ marginTop: '20px' }}>
                            Edit Profile
                        </Button>
                    </Link>
                </ProfileContainer>
                <FormContainer>
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', '& .MuiTextField-root': { m: 1, width: '30ch' }, }}>
                        <TextField required id="firstName" label="First Name" variant="outlined" value={userDetail.nom}/>
                        <TextField required id="lastName" label="Last Name" variant="outlined" value={userDetail.prenom}/>
                        <TextField required id="dateOfBirth" label="Date of Birth" variant="outlined" value={userDetail.dateN}/>
                        <TextField required id="email" label="Email" variant="outlined" value={userDetail.email}/>
                        <TextField required id="password" label="Password" variant="outlined" type="password" />
                            <InputLabel id="demo-simple-select-label">Role</InputLabel>
                                {userPosts && (
                                    <Select
                                    value={selectedPost}
                                    label="Role"
                                    onChange={handleChange}
                                    sx={{ mb: 2, width: 'auto' }}
                                >
                                    {userPosts.map((role: Roles) => (
                                    <MenuItem key={role._id} value={role._id}>{role.Name}</MenuItem>
                                    ))}
                                </Select>
                                )}
                        <Button variant="outlined" color="secondary" style={{ marginTop: '20px' }}>
                            Modify
                        </Button>
                    </Box>
                </FormContainer>
            </OuterContainer>
        )}
        </>
    );
};

export default ProfilePage;