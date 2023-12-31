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
import { CldImage } from 'next-cloudinary';

const API_URL = 'http://localhost:7000/menus';


enum SortOrder {
  NONE = 'NONE',
  ASC = 'ASC',
  DESC = 'DESC',
}

interface SortState {
  field: string;
  order: SortOrder;
}

const initialSortState: SortState = {
  field: '',
  order: SortOrder.NONE,
};

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
  const [initialMenus, setInitialMenus] = useState<Menu[]>([]);
  const [open, setOpen] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState<Menu | null>(null);
  const router = useRouter();
  const [sortState, setSortState] = useState<SortState>(initialSortState);
  const [searchString, setSearchString] = useState<string>("");


  const AscArrow = () => <span> &#9650; </span>; // Upwards arrow
  const DescArrow = () => <span> &#9660; </span>; // Downwards arrow

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

    // Filter the menus based on search string
    useEffect(() => {
      const filteredMenus = initialMenus.filter(menu =>
        menu.Nom.toLowerCase().includes(searchString.toLowerCase())
      );
      setMenus(filteredMenus);
    }, [searchString, initialMenus]);

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      setMenus(response.data);
      setInitialMenus(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const sortData = (field: keyof Menu) => {
    let order = sortState.order;
    let sortedMenus = [...menus];

    if (sortState.field !== field) {
      order = SortOrder.ASC;
    } else {
      order = sortState.order === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
    }

    if (order === SortOrder.NONE) {
      setMenus(initialMenus);
    } else {
      sortedMenus.sort((a, b) => {
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

      setMenus(sortedMenus);
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
        <h2>Menu List</h2>
      </div>

      <Grid container direction="column" justifyContent="center" alignItems="center">
        <Grid item xs={4} sx={{ marginBottom: 2 }}>
          <Button variant="outlined" onClick={() => router.push('/Tables/Menus/createMenu')}>
            Create a Menu
          </Button>
        </Grid>
        <Grid item xs={8} sx={{ marginBottom: 2 }}>
          <TextField 
            fullWidth
            id="search"
            label="Search Name"
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
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('Image')}>
                Image
                {sortState.field === 'Image' &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('Nom')}>
                Name
                {sortState.field === 'Nom' &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('Description')}>
                Description
                {sortState.field === 'Description' &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('Prix')}>
                Price
                {sortState.field === 'Prix' &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('Type')}>
                Type
                {sortState.field === 'Type' &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {menus.map((menu) => (
              <TableRow key={menu._id}>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{menu._id}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>
                  <CldImage width="100" height="100" src={`/Menu/${menu.Image}`} alt={menu.Image}/>
                </TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{menu.Nom}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{menu.Description}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{menu.Prix}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{menu.Type.Name}</TableCell>
                <TableCell sx={{ maxWidth: 120, overflow: 'auto' }}>
                  <Button onClick={() => handleClickOpen(menu)} color="secondary">
                    Delete
                  </Button>
                  <Link href={`/Tables/Menus/${menu._id}`} passHref>
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