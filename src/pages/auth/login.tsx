import Login from '@/components/Partials/auth/login';
import Head from 'next/head';
import { Grid } from '@mui/material';

const login = () => {
  return (
  <>
    <Head>
      <title>Harbor Hotel</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <meta name="description" content="Generated by create next app" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Grid container justifyContent="center" alignItems="center" sx={{ mb: '5%' }}>
      <Login />
    </Grid>
  </>
  );
};

export default login;