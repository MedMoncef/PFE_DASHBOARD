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
} from '@mui/material';
import { useRouter } from 'next/router';
import styles from '@/styles/Title.module.css';

const API_URL = 'http://localhost:7000/sliders';

interface Slider {
  _id: string;
  Image: string;
  Titre: string;
  Text: string;
  DateU: Date;
}

enum SortOrder {
  ASC,
  DESC,
  NONE,
}

interface SortState {
  field: keyof Slider | '';
  order: SortOrder;
}

const initialSortState: SortState = {
  field: '',
  order: SortOrder.NONE,
};

const SlidersTable = () => {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [initialSliders, setInitialSliders] = useState<Slider[]>([]);
  const [sortState, setSortState] = useState<SortState>(initialSortState);
  const [open, setOpen] = useState(false);
  const [sliderToDelete, setSliderToDelete] = useState<Slider | null>(null);
  const router = useRouter();

  const AscArrow = () => <span> &#9650; </span>; // Upwards arrow
  const DescArrow = () => <span> &#9660; </span>; // Downwards arrow

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      setSliders(response.data);
      setInitialSliders(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickOpen = (slider: Slider) => {
    setSliderToDelete(slider);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteSlider = async () => {
    try {
      if (sliderToDelete) {
        await axios.delete(`${API_URL}/${sliderToDelete._id}`);
        setSliders(prevSliders => prevSliders.filter(slider => slider._id !== sliderToDelete._id));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setOpen(false);
    }
  };

  const sortData = (field: keyof Slider) => {
    let order = sortState.order;
    let sortedSliders = [...sliders];

    if (sortState.field !== field) {
      order = SortOrder.ASC;
    } else {
      order = sortState.order === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
    }

    if (order === SortOrder.NONE) {
      setSliders(initialSliders);
    } else {
      sortedSliders.sort((a, b) => {
        const valA = a[field];
        const valB = b[field];

        if (typeof valA === 'string' && typeof valB === 'string') {
          return order === SortOrder.ASC ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }

        if (valA instanceof Date && valB instanceof Date) {
          return order === SortOrder.ASC ? valA.getTime() - valB.getTime() : valB.getTime() - valA.getTime();
        }

        return 0;
      });

      setSliders(sortedSliders);
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
        <h2>Slider List</h2>
      </div>

      <Grid container justifyContent="center" alignItems="center" sx={{ marginBottom: 2 }}>
        <Grid item>
          <Button variant="outlined" onClick={() => router.push('/admin/sliders/create')}>
            Create a Slider
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
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('Image')}>
                Image
                {sortState.field === 'Image' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('Titre')}>
                Titre
                {sortState.field === 'Titre' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('Text')}>
                Text
                {sortState.field === 'Text' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('DateU')}>
                Date
                {sortState.field === 'DateU' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sliders.map(slider => (
              <TableRow key={slider._id}>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{slider._id}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{slider.Image}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{slider.Titre}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{slider.Text}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{slider.DateU}</TableCell>
                <TableCell sx={{ maxWidth: 120, overflow: 'auto' }}>
                  <Button onClick={() => handleClickOpen(slider)} color="secondary">
                    Delete
                  </Button>
                  <Link href={`/Sliders/${slider._id}`} passHref>
                    <Button component="a" color="primary">
                      Detail
                    </Button>
                  </Link>
                  <Link href={`/Sliders/edit/${slider._id}`} passHref>
                    <Button component="a" color="primary">
                      Edit
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete slider?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the slider with ID: {sliderToDelete?._id}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteSlider} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SlidersTable;