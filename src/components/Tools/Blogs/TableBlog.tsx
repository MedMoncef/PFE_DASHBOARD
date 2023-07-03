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

const API_URL = 'http://localhost:7000/blogs';

enum SortOrder {
  NONE = 'NONE',
  ASC = 'ASC',
  DESC = 'DESC',
}

interface BlogPost {
  _id: string;
  Image_B: string;
  Titre: string;
  Content: string;
  DateU: Date;
}

interface SortState {
  field: keyof BlogPost;
  order: SortOrder;
}

const initialSortState: SortState = {
  field: '',
  order: SortOrder.NONE,
};

const BlogTable = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [initialBlogs, setInitialBlogs] = useState<BlogPost[]>([]);
  const [open, setOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const router = useRouter();
  const [sortState, setSortState] = useState<SortState>(initialSortState);
  const AscArrow = () => <span> &#9650; </span>; // Upwards arrow
  const DescArrow = () => <span> &#9660; </span>; // Downwards arrow

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      setBlogPosts(response.data);
      setInitialBlogs(response.data); // Set initial data
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClickOpen = (post: BlogPost) => {
    setPostToDelete(post);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteBlogPost = async () => {
    try {
      if (postToDelete) {
        await axios.delete(`${API_URL}/${postToDelete._id}`);
        setBlogPosts((prevBlogPosts) =>
          prevBlogPosts.filter((post) => post._id !== postToDelete._id)
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setOpen(false);
    }
  };

  const sortData = (field: keyof BlogPost) => {
    let order = sortState.order;
    let sortedBlogs = [...blogPosts];

    if (sortState.field !== field) {
      order = SortOrder.ASC;
    } else {
      order = sortState.order === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
    }

    if (order === SortOrder.NONE) {
      setBlogPosts(initialBlogs);
    } else {
      sortedBlogs.sort((a, b) => {
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

      setBlogPosts(sortedBlogs);
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
        <h2>Blog Posts</h2>
      </div>

      <Grid container justifyContent="center" alignItems="center" sx={{ marginBottom: 2 }}>
        <Grid item>
          <Button variant="outlined" onClick={() => router.push('/Tables/Blogs/createBlog')}>
            Create a Blog Post
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
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('Image_B')}>
                Image
                {sortState.field === 'Image_B' &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('Titre')}>
                Title
                {sortState.field === 'Titre' &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('Content')}>
                Content
                {sortState.field === 'Content' &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('DateU')}>
                Date
                {sortState.field === 'DateU' &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blogPosts.map((post) => (
              <TableRow key={post._id}>
                <TableCell sx={{ maxWidth: 50, overflow: 'auto' }}>{post._id}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>
                 <CldImage width="100" height="100" src={`/Blog/${post.Image_B}`} alt={post.Image_B}/>
                </TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{post.Titre}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{post.Content}</TableCell>
                <TableCell>{new Date(post.DateU).toLocaleDateString()}</TableCell>
                <TableCell sx={{ maxWidth: 120, overflow: 'auto' }}>
                  <Button onClick={() => handleClickOpen(post)} color="secondary">
                    Delete
                  </Button>
                  <Link href={`/Tables/Blogs/${post._id}`} passHref>
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
        <DialogTitle>Delete Blog Post?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the blog post with ID: {postToDelete?._id}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteBlogPost} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BlogTable;