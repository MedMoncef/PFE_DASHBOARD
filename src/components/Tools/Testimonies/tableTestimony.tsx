import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  Link,
  Grid,
  Avatar,
} from '@mui/material';
import { useRouter } from 'next/router';
import styles from '@/styles/Title.module.css';
import { styled } from '@mui/system';
import { CldImage } from 'next-cloudinary';

const API_URL = 'http://localhost:7000/testimonies';

interface Testimony {
  _id: string;
  comment: string;
  name: string;
  image: string;
  title: string;
}

enum SortOrder {
  ASC,
  DESC,
  NONE,
}

interface SortState {
  field: keyof Testimony | '';
  order: SortOrder;
}

const initialSortState: SortState = {
  field: '',
  order: SortOrder.NONE,
};

const UserAvatar = styled(Avatar)({
  width: '75px',
  height: '75px',
  marginBottom: '16px',
});

const TestimoniesTable = () => {
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [initialTestimonies, setInitialTestimonies] = useState<Testimony[]>([]);
  const [sortState, setSortState] = useState<SortState>(initialSortState);
  const [open, setOpen] = useState(false);
  const [testimonyToDelete, setTestimonyToDelete] = useState<Testimony | null>(null);
  const router = useRouter();

  const AscArrow = () => <span> &#9650; </span>; // Upwards arrow
  const DescArrow = () => <span> &#9660; </span>; // Downwards arrow

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      setTestimonies(response.data);
      setInitialTestimonies(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickOpen = (testimony: Testimony) => {
    setTestimonyToDelete(testimony);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteTestimony = async () => {
    try {
      if (testimonyToDelete) {
        await axios.delete(`${API_URL}/${testimonyToDelete._id}`);
        setTestimonies(prevTestimonies =>
          prevTestimonies.filter(testimony => testimony._id !== testimonyToDelete._id)
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setOpen(false);
    }
  };

  const sortData = (field: keyof Testimony) => {
    let order = sortState.order;
    let sortedTestimonies = [...testimonies];

    if (sortState.field !== field) {
      order = SortOrder.ASC;
    } else {
      order = sortState.order === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
    }

    if (order === SortOrder.NONE) {
      setTestimonies(initialTestimonies);
    } else {
      sortedTestimonies.sort((a, b) => {
        const valA = a[field];
        const valB = b[field];

        if (typeof valA === 'string' && typeof valB === 'string') {
          return order === SortOrder.ASC ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }

        return 0;
      });

      setTestimonies(sortedTestimonies);
    }

    setSortState({ field, order });
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: 'white',
        p: 3,
        overflow: 'auto',
        maxHeight: 'auto',
      }}
    >
      <div className={styles.title}>
        <h2>Testimony List</h2>
      </div>

      <Grid container justifyContent="center" alignItems="center" sx={{ marginBottom: 2 }}>
        <Grid item>
          <Button variant="outlined" onClick={() => router.push('/Tables/Testimonies/createTestimony')}>
            Create a Testimony
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ maxWidth: '100%', overflow: 'auto' }}>
        <Table stickyHeader aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('_id')}>
                ID
                {sortState.field === '_id' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('comment')}>
                Comment
                {sortState.field === 'comment' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('name')}>
                Name
                {sortState.field === 'name' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('image')}>
                Image
                {sortState.field === 'image' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('title')}>
                Title
                {sortState.field === 'title' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {testimonies.map(testimony => (
              <TableRow key={testimony._id}>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{testimony._id}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{testimony.comment}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{testimony.name}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>
                  <CldImage width="100" height="100" src={`/Users/${testimony.image}`} alt={testimony.image}/>
                </TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{testimony.title}</TableCell>
                <TableCell sx={{ maxWidth: 120, overflow: 'auto' }}>
                  <Button onClick={() => handleClickOpen(testimony)} color="secondary">
                    Delete
                  </Button>
                  <Link href={`/Tables/Testimonies//${testimony._id}`} passHref>
                    <Button component="a" color="primary">
                      Detail
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete testimony?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the testimony with ID: {testimonyToDelete?._id}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteTestimony} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TestimoniesTable;