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
  TextField,  // added TextField
} from '@mui/material';
import { useRouter } from 'next/router';
import styles from '@/styles/Title.module.css';

const API_URL = 'http://localhost:7000/timetables';

interface TimeTable {
  _id: string;
  user: string;
  loginTime: string;
  loginDate: string;
  isLate: boolean;
}

enum SortOrder {
  ASC,
  DESC,
  NONE,
}

interface SortState {
  field: keyof TimeTable | '';
  order: SortOrder;
}

const initialSortState: SortState = {
  field: '',
  order: SortOrder.NONE,
};

const TimeTablesTable = () => {
  const [timetables, setTimetables] = useState<TimeTable[]>([]);
  const [initialTimetables, setInitialTimetables] = useState<TimeTable[]>([]);
  const [sortState, setSortState] = useState<SortState>(initialSortState);
  const [open, setOpen] = useState(false);
  const [timetableToDelete, setTimeTableToDelete] = useState<TimeTable | null>(null);
  const [searchString, setSearchString] = useState('');  // added searchString state
  const router = useRouter();

  const AscArrow = () => <span> &#9650; </span>; // Upwards arrow
  const DescArrow = () => <span> &#9660; </span>; // Downwards arrow

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filteredTimetables = initialTimetables.filter((timetable) =>
      timetable.user.nom.toLowerCase().includes(searchString.toLowerCase())
    );
    setTimetables(filteredTimetables);
  }, [searchString, initialTimetables]);

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      setTimetables(response.data);
      setInitialTimetables(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickOpen = (timetable: TimeTable) => {
    setTimeTableToDelete(timetable);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteTimeTable = async () => {
    try {
      if (timetableToDelete) {
        await axios.delete(`${API_URL}/delete/${timetableToDelete._id}`);
        setTimetables(prevTimetables =>
          prevTimetables.filter(timetable => timetable._id !== timetableToDelete._id)
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setOpen(false);
    }
  };

  const sortData = (field: keyof TimeTable) => {
    let order = sortState.order;
    let sortedTimetables = [...timetables];

    if (sortState.field !== field) {
      order = SortOrder.ASC;
    } else {
      order = sortState.order === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
    }

    sortedTimetables.sort((a, b) => {
      const valA = a[field];
      const valB = b[field];

      if (valA < valB) {
        return order === SortOrder.ASC ? -1 : 1;
      }
      if (valA > valB) {
        return order === SortOrder.ASC ? 1 : -1;
      }
      return 0;
    });

    setTimetables(sortedTimetables);
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
        <h2>Time Table</h2>
      </div>

      <Grid container direction="column" justifyContent="center" alignItems="center" sx={{ marginBottom: 2 }}>
        <Grid item xs={8} sx={{ marginBottom: 2 }}>
          <TextField 
            fullWidth
            id="search"
            label="Search User"
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
          />
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ maxWidth: '100%', overflow: 'auto' }}>
        <Table stickyHeader aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell onClick={() => sortData('user')}>User</TableCell>
              <TableCell onClick={() => sortData('user')}>User Email</TableCell>
              <TableCell onClick={() => sortData('loginTime')}>Login Time {sortState.field === 'loginTime' && (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}</TableCell>
              <TableCell onClick={() => sortData('loginDate')}>Login Date {sortState.field === 'loginDate' && (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}</TableCell>
              <TableCell onClick={() => sortData('isLate')}>Is Late {sortState.field === 'isLate' && (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {timetables.map((timetable, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {timetable.user.nom} {timetable.user.prenom}
                </TableCell>
                <TableCell>{timetable.user.email}</TableCell>
                <TableCell>{new Date(timetable.loginTime).toLocaleTimeString()}</TableCell>
                <TableCell>{new Date(timetable.loginDate).toLocaleDateString()}</TableCell>
                <TableCell className={timetable.isLate === true ? styles.invalidPaid : styles.validPaid} >{timetable.isLate ? 'Yes' : 'No'}</TableCell>
                <TableCell sx={{ Width: 120, overflow: 'auto' }}>
                  <Button onClick={() => handleClickOpen(timetable)} color="secondary">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete this timetable?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deleting a timetable is irreversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={deleteTimeTable} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TimeTablesTable;
