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

const API_URL = 'http://localhost:7000/menus';

interface Menu {
  _id: string;
  Image: string;
  Nom: string;
  Description: string;
  Prix: number;
  Type: string;
}

const MenuTable = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [open, setOpen] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState<Menu | null>(null);
  const router = useRouter();

  const handleClickOpen = (menu: Menu) => {
    setMenuToDelete(menu);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteMenu = async () => {
    try {
      if (menuToDelete) {
        await axios.delete(`${API_URL}/${menuToDelete._id}`);
        setMenus((prevMenus) =>
          prevMenus.filter((menu) => menu._id !== menuToDelete._id)
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
      setMenus(response.data);
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
        <h2>Menu List</h2>
      </div>

      <Grid container justifyContent="center" alignItems="center" sx={{ marginBottom: 2 }}>
        <Grid item>
          <Button variant="outlined" onClick={() => router.push('/admin/menus/create')}>
            Create a Menu
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ overflow: 'auto' }}>
        <Table stickyHeader aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {menus.map((menu) => (
              <TableRow key={menu._id}>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{menu._id}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}><img src={`/images/Menu/${menu.Image}`} alt={menu.Nom} /></TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{menu.Nom}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{menu.Description}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{menu.Prix}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{menu.Type}</TableCell>
                <TableCell sx={{ maxWidth: 120, overflow: 'auto' }}>
                  <Button onClick={() => handleClickOpen(menu)} color="secondary">
                    Delete
                  </Button>
                  <Link href={`/Menus/${menu._id}`} passHref>
                    <Button component="a" color="primary">
                      Detail
                    </Button>
                  </Link>
                  <Link href={`/Menus/edit/${menu._id}`} passHref>
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
        <DialogTitle>Delete menu?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the menu with ID: {menuToDelete?._id}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteMenu} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MenuTable;