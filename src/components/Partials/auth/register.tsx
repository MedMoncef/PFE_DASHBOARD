import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import { z } from 'zod';
import { Button, Grid , TextField, Paper, Typography, FormLabel, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import axios from 'axios';

const API_URL = 'http://localhost:7000/posts';

const registerSchema = z.object({
  nom: z.string().nonempty('Nom is required'),
  prenom: z.string().nonempty('Prénom is required'),
  dateN: z.string().nonempty('Date of Birth is required'),
  email: z.string().email('Invalid email address').nonempty('Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters').nonempty('Password is required'),
  confirmPassword: z.string().nonempty('Confirm Password is required'),
  id_post: z.string().nonempty('Post is required'),
});

export default function Register() {
  const { register, isLoggedIn } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('Create a New Staff Account!');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [dateN, setDateN] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [image, setImage] = useState('');
  const [id_post, setPost] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [posts, setPosts] = useState([]);

  //HarborHotel Cloudinary Image Upload
    

  interface Post {
    _id: string;
    Name: string;
    Salaire: number;
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // reader.result contains the base64 string
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = (event) => {
    event.preventDefault();
    setNom('');
    setPrenom('');
    setDateN('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setPost('');
    setImage('');
    setErrors({ email: '', password: '' });
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      registerSchema.parse({
        nom,
        prenom,
        dateN,
        email,
        password,
        confirmPassword,
        image,
        id_post,
      });
  
        // Update your register function to handle file upload (you'll need to modify this on your server side too)
        await register(nom, prenom, dateN, email, password, confirmPassword, image, id_post);
        toast('Welcome Back!');
      } catch (error) {
        if (error instanceof z.ZodError) {
          const emailError = error.issues.find((issue) => issue.path[0] === 'email');
          const passwordError = error.issues.find((issue) => issue.path[0] === 'password');
          setErrors({
            email: emailError ? emailError.message : '',
            password: passwordError ? passwordError.message : '',
          });
        }
        console.log("nope!")
      }
    };

  
  useEffect(() => {
    if (isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, router]);

  const handleChange = (event: SelectChangeEvent) => {
    setPost(event.target.value as string);
  };

  const fetchData = async () => {
    const result = await axios(API_URL);
    setPosts(result.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={6} sx={{ p: 4 }}>
              <Typography variant="h4" sx={{ mb: 2, textAlign: 'center' }}>
                {title}
              </Typography>
              <form onSubmit={handleRegister}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Nom"
                      name="nom"
                      type="text"
                      value={nom}
                      onChange={(event) => setNom(event.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Prénom"
                      name="prenom"
                      type="text"
                      value={prenom}
                      onChange={(event) => setPrenom(event.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormLabel htmlFor="checkout_date">Birthday</FormLabel>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="dateN"
                      type="date"
                      value={dateN}
                      onChange={(event) => setDateN(event.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Email Address"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      error={!errors.email}
                      helperText={errors.email}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      error={!errors.password}
                      helperText={errors.password}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <InputLabel id="demo-simple-select-label">Role</InputLabel>
                    <Select
                      fullWidth
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={id_post}
                      label="Age"
                      onChange={handleChange}
                    >

                    {posts.map((id_post: Post) => (
                        <MenuItem key={id_post._id} value={id_post._id}>{id_post.Name}</MenuItem>
                    ))}

                    </Select>
                  </Grid>


                  <Grid item xs={12}>
                    <input
                      type="file"
                      onChange={handleImageChange}
                    />
                  </Grid>

                    

                  <Grid item xs={12}>
                    <Button fullWidth variant="contained" color="primary" type="submit">
                      Register
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button fullWidth variant="outlined" onClick={resetForm}>
                      Reset
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button fullWidth variant="outlined" onClick={() => router.push('/auth/login')}>
                      Login
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
    </>
  );
}