import { useState, useEffect, useRef } from 'react';
import { useTable } from '@/context/TableContext';
import { useAuth } from '@/context/AuthContext';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import styles from '@/styles/Messages.module.css'; // for your styles
import { CldImage } from 'next-cloudinary';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import MessageIcon from '@mui/icons-material/Message';
import MessageOptions from '@/components/Messages/MessageOptions';
import GroupIcon from '@mui/icons-material/Group';
import { SpeedDial, Avatar, ListItemAvatar } from '@mui/material';
import Badge from '@mui/material/Badge';
import MessagesPageWindow from '@/components/Messages/chat';


const MessagesPage = () => {


  return (
      <>
        <MessagesPageWindow />
      </>
      );
};

export default MessagesPage;