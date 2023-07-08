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

const API_URL = 'http://localhost:7000/reservations';

interface Reservation {
  _id: string;
  firstName: string;
  lastName: string;
  Email: string;
  CIN: string;
  ID_Rooms: string;
  Date_Debut: Date;
  Date_Fin: Date;
  Duree: number;
  Prix: number;
  Paid: string;
}

enum SortOrder {
  ASC,
  DESC,
  NONE,
}

interface SortState {
  field: keyof Reservation | '';
  order: SortOrder;
}

const initialSortState: SortState = {
  field: '',
  order: SortOrder.NONE,
};

const ReservationsTable = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [initialReservations, setInitialReservations] = useState<Reservation[]>([]);
  const [sortState, setSortState] = useState<SortState>(initialSortState);
  const [open, setOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState<Reservation | null>(null);
  const router = useRouter();

  const AscArrow = () => <span> &#9650; </span>; // Upwards arrow
  const DescArrow = () => <span> &#9660; </span>; // Downwards arrow

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      setReservations(response.data);
      setInitialReservations(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickOpen = (reservation: Reservation) => {
    setReservationToDelete(reservation);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteReservation = async () => {
    try {
      if (reservationToDelete) {
        await axios.delete(`${API_URL}/${reservationToDelete._id}`);
        setReservations(prevReservations =>
          prevReservations.filter(reservation => reservation._id !== reservationToDelete._id)
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setOpen(false);
    }
  };

  const sortData = (field: keyof Reservation) => {
    let order = sortState.order;
    let sortedReservations = [...reservations];

    if (sortState.field !== field) {
      order = SortOrder.ASC;
    } else {
      order = sortState.order === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
    }

    if (order === SortOrder.NONE) {
      setReservations(initialReservations);
    } else {
      sortedReservations.sort((a, b) => {
        const valA = a[field];
        const valB = b[field];

        if (typeof valA === 'string' && typeof valB === 'string') {
          return order === SortOrder.ASC ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }

        if (valA instanceof Date && valB instanceof Date) {
          return order === SortOrder.ASC ? valA.getTime() - valB.getTime() : valB.getTime() - valA.getTime();
        }

        if (typeof valA === 'number' && typeof valB === 'number') {
          return order === SortOrder.ASC ? valA - valB : valB - valA;
        }

        return 0;
      });

      setReservations(sortedReservations);
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
        <h2>Reservation List</h2>
      </div>

      <Grid container justifyContent="center" alignItems="center" sx={{ marginBottom: 2 }}>
        <Grid item>
          <Button variant="outlined" onClick={() => router.push('/Tables/Reservations/createReservation')}>
            Create a Reservation
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
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('firstName')}>
                First Name
                {sortState.field === 'firstName' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('lastName')}>
                Last Name
                {sortState.field === 'lastName' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('Email')}>
                Email
                {sortState.field === 'Email' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('CIN')}>
                CIN
                {sortState.field === 'CIN' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('ID_Rooms')}>
                Room Type
                {sortState.field === 'ID_Rooms' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('Date_Debut')}>
                Start Date
                {sortState.field === 'Date_Debut' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('Date_Fin')}>
                End Date
                {sortState.field === 'Date_Fin' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('Duree')}>
                Duration
                {sortState.field === 'Duree' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('Prix')}>
                Prix
                {sortState.field === 'Prix' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('Paid')}>
                Payment
                {sortState.field === 'Paid' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.map(reservation => (
              <TableRow key={reservation._id}>
                <TableCell sx={{ maxWidth: 50, overflow: 'auto' }}>{reservation._id}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{reservation.firstName}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{reservation.lastName}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{reservation.Email}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{reservation.CIN}</TableCell>
                <TableCell sx={{ maxWidth: 100, overflow: 'auto' }}>{reservation.ID_Rooms.Name}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{new Date(reservation.Date_Debut).toLocaleDateString()}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{new Date(reservation.Date_Fin).toLocaleDateString()}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{reservation.Duree} Day/s</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{reservation.Prix}$</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }} className={reservation.Paid === 'Invalid' ? styles.invalidPaid : styles.validPaid}>
                  {reservation.Paid}
                </TableCell>
                <TableCell sx={{ maxWidth: 120, overflow: 'auto' }}>
                  <Button onClick={() => handleClickOpen(reservation)} color="secondary">
                    Delete
                  </Button>
                  <Link href={`/Tables/Reservations/${reservation._id}`} passHref>
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
        <DialogTitle>Delete reservation?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the reservation with ID: {reservationToDelete?._id}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteReservation} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReservationsTable;