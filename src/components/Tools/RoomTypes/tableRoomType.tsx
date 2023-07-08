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

const API_URL = 'http://localhost:7000/roomTypes';

interface RoomType {
  _id: string;
  Name: string;
}

enum SortOrder {
  ASC,
  DESC,
  NONE,
}

interface SortState {
  field: keyof RoomType | '';
  order: SortOrder;
}

const initialSortState: SortState = {
  field: '',
  order: SortOrder.NONE,
};

const RoomTypesTable = () => {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [initialRoomTypes, setInitialRoomTypes] = useState<RoomType[]>([]);
  const [sortState, setSortState] = useState<SortState>(initialSortState);
  const [open, setOpen] = useState(false);
  const [roomTypeToDelete, setRoomTypeToDelete] = useState<RoomType | null>(null);
  const router = useRouter();

  const AscArrow = () => <span> &#9650; </span>; // Upwards arrow
  const DescArrow = () => <span> &#9660; </span>; // Downwards arrow

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      setRoomTypes(response.data);
      setInitialRoomTypes(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickOpen = (roomType: RoomType) => {
    setRoomTypeToDelete(roomType);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteRoomType = async () => {
    try {
      if (roomTypeToDelete) {
        await axios.delete(`${API_URL}/${roomTypeToDelete._id}`);
        setRoomTypes(prevRoomTypes =>
          prevRoomTypes.filter(roomType => roomType._id !== roomTypeToDelete._id)
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setOpen(false);
    }
  };

  const sortData = (field: keyof RoomType) => {
    let order = sortState.order;
    let sortedRoomTypes = [...roomTypes];

    if (sortState.field !== field) {
      order = SortOrder.ASC;
    } else {
      order = sortState.order === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
    }

    if (order === SortOrder.NONE) {
      setRoomTypes(initialRoomTypes);
    } else {
      sortedRoomTypes.sort((a, b) => {
        const valA = a[field];
        const valB = b[field];

        if (typeof valA === 'string' && typeof valB === 'string') {
          return order === SortOrder.ASC ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }

        return 0;
      });

      setRoomTypes(sortedRoomTypes);
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
        <h2>Room Type List</h2>
      </div>

      <Grid container justifyContent="center" alignItems="center" sx={{ marginBottom: 2 }}>
        <Grid item>
          <Button variant="outlined" onClick={() => router.push('/Tables/RoomTypes/createRoomType')}>
            Create a Room Type
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
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('Name')}>
                Name
                {sortState.field === 'Name' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roomTypes.map(roomType => (
              <TableRow key={roomType._id}>
                <TableCell sx={{ Width: 200, overflow: 'auto' }}>{roomType._id}</TableCell>
                <TableCell sx={{ Width: 200, overflow: 'auto' }}>{roomType.Name}</TableCell>
                <TableCell sx={{ Width: 120, overflow: 'auto' }}>
                  <Button onClick={() => handleClickOpen(roomType)} color="secondary">
                    Delete
                  </Button>
                  <Link href={`/Tables/RoomTypes/${roomType._id}`} passHref>
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
        <DialogTitle>Delete room type?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the room type with ID: {roomTypeToDelete?._id}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteRoomType} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoomTypesTable;