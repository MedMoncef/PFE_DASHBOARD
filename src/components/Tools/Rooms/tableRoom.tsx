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
import { CldImage } from 'next-cloudinary';

const API_URL = 'http://localhost:7000/rooms';

interface Room {
  _id: string;
  Room_Number: string;
  Floor_Number: string;
  Name: string;
  Image: string;
  Description: string;
  Max: number;
  View: string;
  Size: string;
  Bed_Number: string;
  Type: string;
  Rating: number;
  Price: number;
}

enum SortOrder {
  ASC,
  DESC,
  NONE,
}

interface SortState {
  field: keyof Room | '';
  order: SortOrder;
}

const initialSortState: SortState = {
  field: '',
  order: SortOrder.NONE,
};

const RoomsTable = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [initialRooms, setInitialRooms] = useState<Room[]>([]);
  const [sortState, setSortState] = useState<SortState>(initialSortState);
  const [open, setOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const router = useRouter();

  const AscArrow = () => <span> &#9650; </span>; // Upwards arrow
  const DescArrow = () => <span> &#9660; </span>; // Downwards arrow

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      setRooms(response.data);
      setInitialRooms(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickOpen = (room: Room) => {
    setRoomToDelete(room);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteRoom = async () => {
    try {
      if (roomToDelete) {
        await axios.delete(`${API_URL}/${roomToDelete._id}`);
        setRooms(prevRooms => prevRooms.filter(room => room._id !== roomToDelete._id));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setOpen(false);
    }
  };

  const sortData = (field: keyof Room) => {
    let order = sortState.order;
    let sortedRooms = [...rooms];

    if (sortState.field !== field) {
      order = SortOrder.ASC;
    } else {
      order = sortState.order === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
    }

    if (order === SortOrder.NONE) {
      setRooms(initialRooms);
    } else {
      sortedRooms.sort((a, b) => {
        const valA = a[field];
        const valB = b[field];

        if (typeof valA === 'string' && typeof valB === 'string') {
          return order === SortOrder.ASC ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }

        if (typeof valA === 'number' && typeof valB === 'number') {
          return order === SortOrder.ASC ? valA - valB : valB - valA;
        }

        return 0;
      });

      setRooms(sortedRooms);
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
        <h2>Room List</h2>
      </div>

      <Grid container justifyContent="center" alignItems="center" sx={{ marginBottom: 2 }}>
        <Grid item>
          <Button variant="outlined" onClick={() => router.push('/admin/rooms/create')}>
            Create a Room
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
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('Room_Number')}>
                Room Number
                {sortState.field === 'Room_Number' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('Floor_Number')}>
                Floor Number
                {sortState.field === 'Floor_Number' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('Name')}>
                Name
                {sortState.field === 'Name' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('Image')}>
                Image
                {sortState.field === 'Image' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('Description')}>
                Description
                {sortState.field === 'Description' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('Max')}>
                Max
                {sortState.field === 'Max' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('View')}>
                View
                {sortState.field === 'View' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('Size')}>
                Size
                {sortState.field === 'Size' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('Bed_Number')}>
                Bed Number
                {sortState.field === 'Bed_Number' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('Type')}>
                Type
                {sortState.field === 'Type' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('Price')}>
                Price
                {sortState.field === 'Price' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rooms.map(room => (
              <TableRow key={room._id}>
                <TableCell sx={{ maxWidth: 100, overflow: 'auto' }}>{room._id}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{room.Room_Number}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{room.Floor_Number}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{room.Name}</TableCell>
                <TableCell sx={{ maxWidth: 500, overflow: 'auto' }}>
                 <CldImage width="200" height="200" src={`/Rooms/${room.Image}`} alt={room.Image}/>
                </TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: '5' }}>{room.Description}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{room.Max}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{room.View}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{room.Size}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{room.Bed_Number}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{room.Type.Name}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{room.Price}$</TableCell>
                <TableCell sx={{ maxWidth: 120, overflow: 'auto' }}>
                  <Button onClick={() => handleClickOpen(room)} color="secondary">
                    Delete
                  </Button>
                  <Link href={`/Tables/Rooms/${room._id}`} passHref>
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
        <DialogTitle>Delete room?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the room with ID: {roomToDelete?._id}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteRoom} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoomsTable;