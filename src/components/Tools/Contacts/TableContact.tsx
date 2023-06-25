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

const ContactTable = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [open, setOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const router = useRouter();

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
        setContacts((prevContacts) =>
          prevContacts.filter((contact) => contact._id !== contactToDelete._id)
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
      setContacts(response.data);
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
        <h2>Contact List</h2>
      </div>

      <Grid container justifyContent="center" alignItems="center" sx={{ marginBottom: 2 }}>
        <Grid item>
          <Button variant="outlined" onClick={() => router.push('/admin/contacts/create')}>
            Create a Contact
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ overflow: 'auto' }}>
        <Table stickyHeader aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map((contact) => (
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
                  <Link href={`/Contacts/${contact._id}`} passHref>
                    <Button component="a" color="primary">
                      Detail
                    </Button>
                  </Link>
                  <Link href={`/Contacts/edit/${contact._id}`} passHref>
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