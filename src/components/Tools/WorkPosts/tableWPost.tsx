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
import SearchIcon from '@mui/icons-material/Search';


const API_URL = 'http://localhost:7000/posts';
const API_URL_DELETE = 'http://localhost:7000/delete_post';

interface WorkPost {
  _id: string;
  Name: string;
  Salaire: number;
}

enum SortOrder {
  ASC,
  DESC,
  NONE,
}

interface SortState {
  field: keyof WorkPost | '';
  order: SortOrder;
}

const initialSortState: SortState = {
  field: '',
  order: SortOrder.NONE,
};

const WorkPostsTable = () => {
  const [workPosts, setWorkPosts] = useState<WorkPost[]>([]);
  const [initialWorkPosts, setInitialWorkPosts] = useState<WorkPost[]>([]);
  const [sortState, setSortState] = useState<SortState>(initialSortState);
  const [open, setOpen] = useState(false);
  const [workPostToDelete, setWorkPostToDelete] = useState<WorkPost | null>(null);
  const router = useRouter();
  const [search, setSearch] = useState(''); // New: State variable for search

  const AscArrow = () => <span> &#9650; </span>; // Upwards arrow
  const DescArrow = () => <span> &#9660; </span>; // Downwards arrow

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => { // New: Effect for filtering data
    filterData();
  }, [search, initialWorkPosts]);

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      setWorkPosts(response.data);
      setInitialWorkPosts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const filterData = () => { // New: Function for filtering data
    const filteredWorkPosts = initialWorkPosts.filter(workPost =>
      workPost.Name.toLowerCase().includes(search.toLowerCase())
    );
    setWorkPosts(filteredWorkPosts);
  };

  const handleClickOpen = (workPost: WorkPost) => {
    setWorkPostToDelete(workPost);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteWorkPost = async () => {
    try {
      if (workPostToDelete) {
        await axios.delete(`${API_URL_DELETE}/${workPostToDelete._id}`);
        setWorkPosts(prevWorkPosts =>
          prevWorkPosts.filter(workPost => workPost._id !== workPostToDelete._id)
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setOpen(false);
    }
  };

  const sortData = (field: keyof WorkPost) => {
    let order = sortState.order;
    let sortedWorkPosts = [...workPosts];

    if (sortState.field !== field) {
      order = SortOrder.ASC;
    } else {
      order = sortState.order === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
    }

    if (order === SortOrder.NONE) {
      setWorkPosts(initialWorkPosts);
    } else {
      sortedWorkPosts.sort((a, b) => {
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

      setWorkPosts(sortedWorkPosts);
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
        <h2>Work Post List</h2>
      </div>

      <Grid container direction="column" justifyContent="center" alignItems="center">
        <Grid item sx={{ marginBottom: 2 }}>
          <Button variant="outlined" onClick={() => router.push('/Tables/WorkPosts/createWorkPost')}>
            Create a Work Post
          </Button>
        </Grid>
        <Grid item xs={12} md={6} sx={{ marginBottom: 2 }}>
          <TextField // New: TextField for search
            label="Search"
            variant="outlined"
            value={search}
            onChange={e => setSearch(e.target.value)}
            fullWidth
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
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('Name')}>
                Name
                {sortState.field === 'Name' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('Salaire')}>
                Salary
                {sortState.field === 'Salaire' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workPosts.map(workPost => (
              <TableRow key={workPost._id}>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{workPost._id}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{workPost.Name}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{workPost.Salaire}</TableCell>
                <TableCell sx={{ maxWidth: 120, overflow: 'auto' }}>
                  <Button onClick={() => handleClickOpen(workPost)} color="secondary">
                    Delete
                  </Button>
                  <Link href={`/Tables/WorkPosts/${workPost._id}`} underline="none">
                    <Button color="primary">Edit</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{"Are you sure you want to delete this work post?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {workPostToDelete && (
              <span>
                {workPostToDelete._id} - {workPostToDelete.Name}
              </span>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={deleteWorkPost} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkPostsTable;