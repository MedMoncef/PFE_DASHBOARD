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
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import CreateIcon from '@mui/icons-material/Create';
import styles from '@/styles/Title.module.css';

const API_URL = 'http://localhost:7000/blogs';

interface Blog {
  _id: number;
  Image: string;
  Titre: string;
  Content: string;
  DateU: string;
}

const TableBlog = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [open, setOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);
  const router = useRouter();

  const handleClickOpen = (blog: Blog) => {
    setBlogToDelete(blog);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteBlog = async () => {
    try {
      if (blogToDelete) {
        await axios.delete(`${API_URL}/${blogToDelete._id}`);
        setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== blogToDelete._id));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setOpen(false);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      setBlogs(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box 
      sx={{ 
        flexGrow: 1, 
        backgroundColor: 'white', 
        p: 3, 
        overflow: 'auto',   // add this line
        maxHeight: 'auto', // add this line
      }}
    >
      <div className={styles.title}>
        <h2>Hotel Blogs</h2>
      </div>

      <Grid container justifyContent="center" alignItems="center" sx={{ marginBottom: 2 }}>
        <Grid item>
          <Button
            startIcon={<CreateIcon />}
            variant="outlined"
            onClick={() => router.push('/admin/blogs/create')}
          >
            Create a Blog
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ maxHeight: 440, overflow: 'auto' }}>
        <Table stickyHeader aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Titre</TableCell>
              <TableCell>Content</TableCell>
              <TableCell>DateU</TableCell>
              <TableCell>Delete</TableCell>
              <TableCell>Detail</TableCell>
              <TableCell>Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blogs.map((blog) => (
              <TableRow key={blog._id}>
                <TableCell>{blog._id}</TableCell>
                <TableCell>{blog.Image}</TableCell>
                <TableCell>{blog.Titre}</TableCell>
                <TableCell>{blog.Content}</TableCell>
                <TableCell>{blog.DateU}</TableCell>
                <TableCell>
                  <Button onClick={() => handleClickOpen(blog)} color="secondary">
                    Delete
                  </Button>
                </TableCell>
                <TableCell>
                  <Link href={`/blogs/${blog._id}`} passHref>
                    <Button component="a" color="primary">
                      Detail
                    </Button>
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/blogs/edit/${blog._id}`} passHref>
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
        <DialogTitle>Delete blog?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the blog with ID: {blogToDelete?._id}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteBlog} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TableBlog;