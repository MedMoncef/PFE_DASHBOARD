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

const API_URL = 'http://localhost:7000/reviews';

interface Review {
  _id: string;
  oneStar: number;
  twoStars: number;
  threeStars: number;
  fourStars: number;
  fiveStars: number;
}

enum SortOrder {
  ASC,
  DESC,
  NONE,
}

interface SortState {
  field: keyof Review | '';
  order: SortOrder;
}

const initialSortState: SortState = {
  field: '',
  order: SortOrder.NONE,
};

const ReviewsTable = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [initialReviews, setInitialReviews] = useState<Review[]>([]);
  const [sortState, setSortState] = useState<SortState>(initialSortState);
  const [open, setOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);
  const router = useRouter();

  const AscArrow = () => <span> &#9650; </span>; // Upwards arrow
  const DescArrow = () => <span> &#9660; </span>; // Downwards arrow

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      setReviews(response.data);
      setInitialReviews(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickOpen = (review: Review) => {
    setReviewToDelete(review);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteReview = async () => {
    try {
      if (reviewToDelete) {
        await axios.delete(`${API_URL}/${reviewToDelete._id}`);
        setReviews(prevReviews =>
          prevReviews.filter(review => review._id !== reviewToDelete._id)
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setOpen(false);
    }
  };

  const sortData = (field: keyof Review) => {
    let order = sortState.order;
    let sortedReviews = [...reviews];

    if (sortState.field !== field) {
      order = SortOrder.ASC;
    } else {
      order = sortState.order === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
    }

    if (order === SortOrder.NONE) {
      setReviews(initialReviews);
    } else {
      sortedReviews.sort((a, b) => {
        const valA = a[field];
        const valB = b[field];

        if (typeof valA === 'number' && typeof valB === 'number') {
          return order === SortOrder.ASC ? valA - valB : valB - valA;
        }

        return 0;
      });

      setReviews(sortedReviews);
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
        <h2>Review List</h2>
      </div>

      <Grid container justifyContent="center" alignItems="center" sx={{ marginBottom: 2 }}>
        <Grid item>
          <Button variant="outlined" onClick={() => router.push('/admin/reviews/create')}>
            Create a Review
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ maxWidth: 1120, overflow: 'auto' }}>
        <Table stickyHeader aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('_id')}>
                ID
                {sortState.field === '_id' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('oneStar')}>
                One Star
                {sortState.field === 'oneStar' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('twoStars')}>
                Two Stars
                {sortState.field === 'twoStars' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('threeStars')}>
                Three Stars
                {sortState.field === 'threeStars' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('fourStars')}>
                Four Stars
                {sortState.field === 'fourStars' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('fiveStars')}>
                Five Stars
                {sortState.field === 'fiveStars' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviews.map(review => (
              <TableRow key={review._id}>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{review._id}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{review.oneStar}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{review.twoStars}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{review.threeStars}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{review.fourStars}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{review.fiveStars}</TableCell>
                <TableCell sx={{ maxWidth: 120, overflow: 'auto' }}>
                  <Button onClick={() => handleClickOpen(review)} color="secondary">
                    Delete
                  </Button>
                  <Link href={`/Reviews/${review._id}`} passHref>
                    <Button component="a" color="primary">
                      Detail
                    </Button>
                  </Link>
                  <Link href={`/Reviews/edit/${review._id}`} passHref>
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
        <DialogTitle>Delete review?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the review with ID: {reviewToDelete?._id}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteReview} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReviewsTable;