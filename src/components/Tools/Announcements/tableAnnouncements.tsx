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
  Grid,
  TextField,
} from '@mui/material';
import { useRouter } from 'next/router';
import styles from '@/styles/Title.module.css';

const API_URL = 'http://localhost:7000/announcements';

interface Announcement {
  _id: string;
  Message: string;
  ID_Sent: string;
  ID_SentTo: string;
  Date_Uploaded: Date | string;
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
  const [searchString, setSearchString] = useState("");
  const router = useRouter();

  const AscArrow = () => <span> &#9650; </span>; // Upwards arrow
  const DescArrow = () => <span> &#9660; </span>; // Downwards arrow

  useEffect(() => {
    if (searchString === "") {
      setAnnouncements(initialAnnouncements);
    } else {
      const filteredAnnouncements = initialAnnouncements.filter((announcement) =>
        announcement.Titre.toLowerCase().includes(searchString.toLowerCase())
      );
      setAnnouncements(filteredAnnouncements);
    }
  }, [searchString, initialAnnouncements]);

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      setAnnouncements(response.data);
      console.log(announcements.Message);
      setInitialAnnouncements(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
        setAnnouncements(prevAnnouncements => prevAnnouncements.filter(announcement => announcement._id !== announcementToDelete._id));
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

        if (valA instanceof Date && valB instanceof Date) {
          return order === SortOrder.ASC ? valA.getTime() - valB.getTime() : valB.getTime() - valA.getTime();
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
        <h2>Announcement List</h2>
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
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('Message')}>
              Message
                {sortState.field === 'Message' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('ID_Sent')}>
              Sent By
                {sortState.field === 'ID_Sent' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('Date_Uploaded')}>
                Date Uploaded
                {sortState.field === 'Date_Uploaded' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {announcements.map((announcement) => (
              <TableRow key={announcement._id}>
                <TableCell>{announcement._id}</TableCell>
                <TableCell>{announcement.Message}</TableCell>
                <TableCell>{announcement.ID_Sent.nom} {announcement.ID_Sent.prenom}</TableCell>
                <TableCell>{new Date(announcement.Date_Uploaded).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button onClick={() => router.push(`/Tables/Announcements/${announcement._id}`)}>
                    Edit
                  </Button>
                  <Button onClick={() => handleClickOpen(announcement)}>Delete</Button>
                  <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Delete Announcement</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Are you sure you want to delete this announcement?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose}>No</Button>
                      <Button onClick={deleteAnnouncement} autoFocus>
                        Yes
                      </Button>
                    </DialogActions>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AnnouncementsTable;