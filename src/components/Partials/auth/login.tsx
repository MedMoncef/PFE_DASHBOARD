import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import { z } from 'zod';
import { Button, Grid, TextField, Paper, Typography } from '@mui/material';

const loginSchema = z.object({
  email: z.string().email('Invalid email address').nonempty('Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters').nonempty('Password is required'),
});

export default function Login() {
  const { login, isLoggedIn } = useAuth();
  const router = useRouter();
  const [formState, setFormState] = useState({
    title: 'Welcome, please login!',
    email: '',
    password: '',
    errors: { email: '', password: '' },
  });

  const resetForm = (event) => {
    event.preventDefault();
    setFormState({
      title: 'Welcome, please login!',
      email: '',
      password: '',
      errors: { email: '', password: '' },
    });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      loginSchema.parse({
        email: formState.email,
        password: formState.password,
      });
  
      await login(formState.email, formState.password);
      toast('Welcome Back!');
      router.push('/');
    } catch (error) {
      if (error instanceof z.ZodError) {
        const emailError = error.issues.find((issue) => issue.path[0] === 'email');
        const passwordError = error.issues.find((issue) => issue.path[0] === 'password');
        setFormState((prevState) => ({
          ...prevState,
          errors: {
            email: emailError ? emailError.message : '',
            password: passwordError ? passwordError.message : '',
          },
        }));
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, router]);

  const { title, email, password, errors } = formState;

  return (
    <>    
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={6} sx={{ p: 4 }}>
              <Typography variant="h4" sx={{ mb: 2, textAlign: 'center' }}>
                {title}
              </Typography>
              <form onSubmit={handleLogin}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Email Address"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setFormState((prevState) => ({ ...prevState, email: event.target.value }))
                      }
                      error={!!errors.email}
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
                      onChange={(event) =>
                        setFormState((prevState) => ({ ...prevState, password: event.target.value }))
                      }
                      error={!!errors.password}
                      helperText={errors.password}
                    />
                  </Grid>          
                  <Grid item xs={12}>
                    <Button fullWidth variant="contained" color="primary" type="submit">
                      Login
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button fullWidth variant="outlined" onClick={resetForm}>
                      Reset
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button fullWidth variant="outlined" onClick={() => router.push('/auth/register')}>
                      Register
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
    </>
  );
}