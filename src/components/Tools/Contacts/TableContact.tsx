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

const API_URL = 'http://localhost:7000/contacts';

interface Contact {
  _id: string;
  Nom: string;
  Email: string;
  Sujet: string;
  Message: string;
}

enum SortOrder {
  ASC,
  DESC,
  NONE,
}

interface SortState {
  field: keyof Contact | '';
  order: SortOrder;
}

const initialSortState: SortState = {
  field: '',
  order: SortOrder.NONE,
};

const ContactTable = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [initialContacts, setInitialContacts] = useState<Contact[]>([]);
  const [sortState, setSortState] = useState<SortState>(initialSortState);
  const [open, setOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const router = useRouter();

  const AscArrow = () => <span> &#9650; </span>; // Upwards arrow
  const DescArrow = () => <span> &#9660; </span>; // Downwards arrow

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      setContacts(response.data);
      setInitialContacts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickOpen = (contact: Contact) => {
    setContactToDelete(contact);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteContact = async () => {
    try {
      if (contactToDelete) {
        await axios.delete(`${API_URL}/${contactToDelete._id}`);
        setContacts(prevContacts =>
          prevContacts.filter(contact => contact._id !== contactToDelete._id)
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setOpen(false);
    }
  };

  const sortData = (field: keyof Contact) => {
    let order = sortState.order;
    let sortedContacts = [...contacts];

    if (sortState.field !== field) {
      order = SortOrder.ASC;
    } else {
      order = sortState.order === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
    }

    if (order === SortOrder.NONE) {
      setContacts(initialContacts);
    } else {
      sortedContacts.sort((a, b) => {
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

      setContacts(sortedContacts);
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
        <h2>Contact List</h2>
      </div>

      <Grid container justifyContent="center" alignItems="center" sx={{ marginBottom: 2 }}>
        <Grid item>
          <Button variant="outlined" onClick={() => router.push('/admin/contacts/create')}>
            Create a Contact
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
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('Nom')}>
                Name
                {sortState.field === 'Nom' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('Email')}>
                Email
                {sortState.field === 'Email' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('Sujet')}>
                Subject
                {sortState.field === 'Sujet' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => sortData('Message')}>
                Message
                {sortState.field === 'Message' &&
                  sortState.order !== SortOrder.NONE &&
                  (sortState.order === SortOrder.ASC ? <AscArrow /> : <DescArrow />)}
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map(contact => (
              <TableRow key={contact._id}>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{contact._id}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{contact.Nom}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{contact.Email}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{contact.Sujet}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'auto' }}>{contact.Message}</TableCell>
                <TableCell sx={{ maxWidth: 120, overflow: 'auto' }}>
                  <Button onClick={() => handleClickOpen(contact)} color="secondary">
                    Delete
                  </Button>
                  <Link href={`/Tables/Contacts/${contact._id}`} passHref>
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
        <DialogTitle>Delete contact?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the contact with ID: {contactToDelete?._id}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteContact} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContactTable;