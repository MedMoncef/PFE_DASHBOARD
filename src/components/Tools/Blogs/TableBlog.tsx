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

const API_URL = 'http://localhost:7000/blogs';

interface BlogPost {
  _id: string;
  Image: string;
  Titre: string;
  Content: string;
  DateU: Date;
}

const BlogTable = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [open, setOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const router = useRouter();

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

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      setBlogPosts(response.data);
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

      <TableContainer component={Paper} sx={{ overflow: 'auto' }}>
        <Table stickyHeader aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Content</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blogPosts.map((post) => (
              <TableRow key={post._id}>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{post._id}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}><img src={`/images/Blog/${post.Image}`} alt={post.Nom} /></TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{post.Titre}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{post.Content}</TableCell>
                <TableCell>{new Date(post.DateU).toLocaleDateString()}</TableCell>
                <TableCell sx={{ maxWidth: 120, overflow: 'auto' }}>
                  <Button onClick={() => handleClickOpen(post)} color="secondary">
                    Delete
                  </Button>
                  <Link href={`/Blogs/${post._id}`} passHref>
                    <Button component="a" color="primary">
                      Detail
                    </Button>
                  </Link>
                  <Link href={`/Blogs/edit/${post._id}`} passHref>
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