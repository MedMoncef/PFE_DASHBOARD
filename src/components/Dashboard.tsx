import React from 'react';
import { Box, Card, CardContent, Typography, LinearProgress, Grid } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import TableTime from '@/components/Tools/TableTime';
import styles from '@/styles/Title.module.css';
import KingBedIcon from '@mui/icons-material/KingBed';
import BookmarksIcon from '@mui/icons-material/Bookmarks';

const Dashboard = () => {
  return (
    <Box sx={{ flexGrow: 1, backgroundColor: 'white' }}>
      <div className={styles.title}>
        <h2>Hotel Information</h2>
      </div>
      <Box sx={{ p: 3 }}>
        <Grid container spacing={2}>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ display: 'flex' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                  <Typography component="div" variant="h5">
                    Staff Available
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" component="div">
                    19
                  </Typography>
                </CardContent>
                <Box sx={{ pb: 2, marginLeft: '20px' }}>
                  <LinearProgress variant="determinate" value={91} />
                </Box>
              </Box>
              <PeopleIcon sx={{ fontSize: '8rem', margin: '10px', color: '#3f51b5' }} />
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ display: 'flex' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                  <Typography component="div" variant="h5">
                    Rooms Available
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" component="div">
                    5
                  </Typography>
                </CardContent>
                <Box sx={{ pb: 2, marginLeft: '20px' }}>
                  <LinearProgress variant="determinate" value={90} />
                </Box>
              </Box>
              <KingBedIcon sx={{ fontSize: '8rem', margin: '10px', color: '#3f51b5' }} />
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ display: 'flex' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                  <Typography component="div" variant="h5">
                    Valid Reservations
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" component="div">
                    26
                  </Typography>
                </CardContent>
                <Box sx={{ pb: 2, marginLeft: '20px' }}>
                  <LinearProgress variant="determinate" value={74} />
                </Box>
              </Box>
              <BookmarksIcon sx={{ fontSize: '8rem', margin: '10px', color: '#3f51b5' }} />
            </Card>
          </Grid>

        </Grid>
      </Box>

      <div className={styles.title}>
        <h2>Time Table</h2>
      </div>

        <TableTime />
    </Box>
  );
};

export default Dashboard;