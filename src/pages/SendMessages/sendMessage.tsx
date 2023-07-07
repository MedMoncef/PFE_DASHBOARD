import { useState, useEffect, useRef } from 'react';
import { useTable } from '@/context/TableContext';
import { useAuth } from '@/context/AuthContext';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import styles from '@/styles/Messages.module.css'; // for your styles
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { CldImage } from 'next-cloudinary';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import MessageIcon from '@mui/icons-material/Message';
import MessageOptions from '@/components/Messages/MessageOptions';
import GroupIcon from '@mui/icons-material/Group';

const MessagesPage = () => {
    const { submitMessageForm } = useTable();
    const [messageList, setMessageList] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [myID, setMyID] = useState("");
    const [myID_Post, setMyID_Post] = useState("");
    const { isLoggedIn } = useAuth();
    const messagesEndRef = useRef(null);
    const [userList, setUserList] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [open, setOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [groupUsers, setGroupUsers] = useState([]);
    const [id_Post_Details, setId_Post_Details] = useState("");


    const handleOpen = () => {
        setOpen(true);
      };
      
      const handleClose = () => {
        setOpen(false);
      };
      

      const handleUserClick = (userId) => {
        setSelectedUser(userId);
        const user = userList.find(user => user._id === userId);
        setCurrentUser(user);
        
        if (userId === "Group") {
            fetchGroupMessages();
        } else {
            fetchMessages(userId);
        }
    };
    
    

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(scrollToBottom, [messageList]);

    // Simulating a fetch operation from the db
    useEffect(() => {
      if(isLoggedIn) {
        const token = localStorage.getItem('token');
        const decodedToken = jwt_decode(token);
        setMyID(decodedToken.user_id);
        setMyID_Post(decodedToken.id_post);
      }
    }, [isLoggedIn]);

    useEffect(() => {
        const fetchUsers = async () => {
          try {
            const response = await axios.get('http://localhost:7000/users');
            setUserList(response.data);
            setId_Post_Details(response.data.id_post);
          } catch (error) {
            console.error('Failed to fetch users:', error);
          }
        };
  
        fetchUsers();
      }, []);


      const fetchMessages = async (selectedUser) => {
        try {
          const response = await axios.get(`http://localhost:7000/messages/${selectedUser}/${myID}`);
          setMessageList(response.data);
        } catch (error) {
          console.error('Failed to fetch messages:', error);
        }
      };

      const fetchGroupMessages = async () => {
        try {
          const response = await axios.get(`http://localhost:7000/groupMessages/${myID_Post}`);
          setMessageList(response.data);
        } catch (error) {
          console.error('Failed to fetch messages:', error);
        }
      }; 
      

      const sendMessage = async () => {
        if (newMessage.trim() !== "") {
          const formData = {
            messageContent: newMessage,
            ID_Sent: String(myID),
            ID_SentTo: selectedUser === "Group" ? "Group" : String(selectedUser),
            ID_PostSent: String(myID_Post),
          };
      
          console.log(formData);
          await submitMessageForm(formData);
          setNewMessage("");
          if (selectedUser === "Group") {
            fetchGroupMessages();
          } else {
            fetchMessages(selectedUser);
          }
        }
      };
      
      
      const deleteMessages = async () => {
        try {
          const response = await axios.delete(`http://localhost:7000/messages/${myID}/${selectedUser}`);
          if (response.status === 200) {
            setMessageList([]); // clear the messages from state only when the deletion was successful
          } else {
            throw new Error("Failed to delete messages");
          }
        } catch (error) {
          console.error('Failed to delete messages:', error);
        }
      };

      const deleteMessageById = async (messageId) => {
        try {
          const response = await axios.delete(`http://localhost:7000/messages/${messageId}`);
          if (response.status === 200) {
            setMessageList(messageList.filter(message => message._id !== messageId));
          } else {
            throw new Error("Failed to delete message");
          }
        } catch (error) {
          console.error('Failed to delete message:', error);
        }
      };
    

    return (
        <div className={styles.container}>
            <div className={styles.currentUserBar}>
                {currentUser && (
                    <>
                        <div className={styles.userInfo}>
                            <ListItemAvatar>
                                <Avatar variant="rounded">
                                    <CldImage width="50" height="50" src={`/Users/${currentUser.image}`} alt={currentUser.image}/>
                                </Avatar>
                            </ListItemAvatar>
                            <h2 className={styles.userName}>{currentUser.nom}</h2>
                            <h2 className={styles.userName}>{currentUser.prenom}</h2>
                        </div>
                        <button onClick={deleteMessages}>Delete Messages</button>
                    </>
                )}
            </div>


                    <div className={styles.floatingButtonContainer}>
                        <SpeedDial
                            ariaLabel="SpeedDial openIcon example"
                            open={open}
                            onOpen={handleOpen}
                            onClose={handleClose}
                            icon={<MessageIcon />}
                        >
                            {userList.filter(user => user._id !== myID).map((user) => (
                                <SpeedDialAction
                                    key={user._id}
                                    icon={
                                        <Avatar variant="rounded">
                                            <CldImage width="50" height="50" src={`/Users/${user.image}`} alt={user.image}/>
                                        </Avatar>
                                        }
                                    tooltipTitle={user.name}
                                    onClick={() => handleUserClick(user._id)}
                                />
                            ))}
                            <SpeedDialAction
                                icon={
                                    <Avatar variant="rounded">
                                        <GroupIcon width="50" height="50"/>
                                    </Avatar>
                                    }
                                tooltipTitle="Group Chat"
                                onClick={() => handleUserClick("Group")}
                            />
                        </SpeedDial>
                    </div>


            <div className={styles.messagesContainer}>
                <div className={styles.spacer}></div>
                {messageList.map((message, index) => (
                    <div key={index} className={message.ID_Sent === myID ? styles.myMessage : styles.otherMessage}>
                        <div className={styles.options}>
                            <MessageOptions messageId={message._id} deleteMessage={deleteMessageById} />
                        </div>
                    <div className={styles.content}>{message.Message}</div>
                    </div>
                    ))}
            </div>
            <div className={styles.inputContainer}>
                <input
                type="text"
                className={styles.messageInput}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                />
                <button className={styles.sendButton} onClick={sendMessage}>Send</button>
            </div>
            </div>
    );
};

export default MessagesPage;