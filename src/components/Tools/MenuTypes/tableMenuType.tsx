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
  TextField,
} from '@mui/material';
import { useRouter } from 'next/router';
import styles from '@/styles/Title.module.css';

const API_URL = 'http://localhost:7000/announcements';

interface Announcement {
  _id: string;
  Title: string;
  Text: string;
}

enum SortOrder {
  ASC,
  DESC,
  NONE,
}

interface SortState {
  field: keyof Announcement | '';
  order: SortOrder;
}

const initialSortState: SortState = {
  field: '',
  order: SortOrder.NONE,
};

const AnnouncementsTable = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [initialAnnouncements, setInitialAnnouncements] = useState<Announcement[]>([]);
  const [sortState, setSortState] = useState<SortState>(initialSortState);
  const [open, setOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null);
  const [searchString, setSearchString] = useState('');
  const router = useRouter();

  const AscArrow = () => <span> &#9650; </span>; // Upwards arrow
  const DescArrow = () => <span> &#9660; </span>; // Downwards arrow

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      setAnnouncements(response.data);
      setInitialAnnouncements(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const filteredAnnouncements = initialAnnouncements.filter((announcement) =>
      announcement.Title.toLowerCase().includes(searchString.toLowerCase())
    );
    setAnnouncements(filteredAnnouncements);
  }, [searchString, initialAnnouncements]);

  const handleClickOpen = (announcement: Announcement) => {
    setAnnouncementToDelete(announcement);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteAnnouncement = async () => {
    try {
      if (announcementToDelete) {
        await axios.delete(`${API_URL}/${announcementToDelete._id}`);
        setAnnouncements(prevAnnouncements =>
          prevAnnouncements.filter(announcement => announcement._id !== announcementToDelete._id)
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setOpen(false);
    }
  };

  const sortData = (field: keyof Announcement) => {
    let order = sortState.order;
    let sortedAnnouncements = [...announcements];

    if (sortState.field !== field) {
      order = SortOrder.ASC;
    } else {
      order = sortState.order === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
    }

    if (order === SortOrder.NONE) {
      setAnnouncements(initialAnnouncements);
    } else {
      sortedAnnouncements.sort((a, b) => {
        const valA = a[field];
        const valB = b[field];

        if (typeof valA === 'string' && typeof valB === 'string') {
          return order === SortOrder.ASC ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }

        return 0;
      });

      setAnnouncements(sortedAnnouncements);
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
        <h2>Announcements List</h2>
      </div>

      <Grid container direction="column" justifyContent="center" alignItems="center">
        <Grid item xs={4} sx={{ marginBottom: 2 }}>
          <Button variant="outlined" onClick={() => router.push('/Tables/Announcements/createAnnouncement')}>
            Create an Announcement
          </Button>
        </Grid>
        <Grid item xs={8} sx={{ marginBottom: 2 }}>
          <TextField 
            fullWidth
            id="search"
            label="Search Title"
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
          />
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
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('Title')}>
                Title
                {sortState.field === 'Title' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell>Text</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {announcements.map(announcement => (
              <TableRow key={announcement._id}>
                <TableCell sx={{ Width: 200, overflow: 'auto' }}>{announcement._id}</TableCell>
                <TableCell sx={{ Width: 200, overflow: 'auto' }}>{announcement.Title}</TableCell>
                <TableCell sx={{ Width: 200, overflow: 'auto' }}>{announcement.Text}</TableCell>
                <TableCell sx={{ Width: 120, overflow: 'auto' }}>
                  <Button onClick={() => handleClickOpen(announcement)} color="secondary">
                    Delete
                  </Button>
                  <Link href={`/Tables/Announcements/${announcement._id}`} passHref>
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
        <DialogTitle>Delete announcement?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the announcement with ID: {announcementToDelete?._id}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteAnnouncement} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AnnouncementsTable;