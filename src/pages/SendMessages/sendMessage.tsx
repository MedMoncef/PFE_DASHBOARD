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
    const [allMessages, setAllMessages] = useState([]);
    const [unreadMessageGroup, setUnreadMessageGroup] = useState(0);


    const fetchAllMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:7000/messages`);
        setAllMessages(response.data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    useEffect(() => {
      fetchAllMessages();
    }, []);
    
    
    const handleOpen = () => {
        setOpen(true);
      };
      
      const handleClose = () => {
        setOpen(false);
      };
      
      
      const handleUserClick = async (userId) => {
        setSelectedUser(userId);
        const user = userList.find(user => user._id === userId);
        setCurrentUser(user);
        
        if (userId === "Group") {
            fetchGroupMessages();
        } else {
            fetchMessages(userId);
        }
      
        // update the view of the messages
        const unreadMessages = allMessages.filter(
          message => message.View === false && (message.ID_Sent === userId || message.ID_SentTo === userId)
        );
        for (let message of unreadMessages) {
          try {
            await axios.put(`http://localhost:7000/messages/${message._id}`, { View: true });
          } catch (error) {
            console.error('Failed to update message:', error);
          }
        }
      
        // refetch all messages to get the updated ones
        fetchAllMessages();
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
        console.log(typeof(decodedToken.id_post));  // log the id_post of the current user
        console.log(decodedToken.id_post);
      }
    }, [isLoggedIn]);
    

    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await axios.get('http://localhost:7000/users');
          console.log(response.data);
          setUserList(response.data);

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

      useEffect(() => {
        // Fetch messages immediately on component mount
        if (selectedUser === "Group") {
          fetchGroupMessages();
        } else {
          fetchMessages(selectedUser);
        }
      
        // Then fetch every 5 seconds
        const intervalId = setInterval(() => {
          if (selectedUser === "Group") {
            fetchGroupMessages();
          } else {
            fetchMessages(selectedUser);
          }
        }, 2000);
      
        // Clear interval on component unmount
        return () => clearInterval(intervalId);
      }, [selectedUser]);
      
      
      
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

      async function fetchUnreadMessages() {
        try {
          const response = await axios.get('http://localhost:7000/messages');
          
          if (response.status === 200) {
      
            const groupMessages = response.data.filter(
              message => message.ID_SentTo === 'Group' && message.ID_PostSent === myID_Post && message.View === false && message.ID_Sent != myID
            );

            
      
            const totalUnread = groupMessages.length;
      
            setUnreadMessageGroup(totalUnread);
          }
        } catch (error) {
          console.error('Error fetching unread messages', error);
        }
      }

      useEffect(() => {
        if (myID && myID_Post) {
          fetchUnreadMessages();

          const intervalId = setInterval(fetchUnreadMessages, 1000);
    
          // Clear interval on component unmount or if user_ID and post_ID change
          return () => clearInterval(intervalId);
        }
      }, [myID, myID_Post]);
    
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
              direction="right"
            >
              {userList
                .filter(user => user._id !== myID && user.id_post._id === myID_Post)
                .map((user) => {
                  const unreadMessageCount = allMessages.filter(
                    message => message.View === false && message.ID_Sent === user._id && message.ID_SentTo != "Group"
                  ).length;

                  return (
                    <SpeedDialAction
                      key={user._id}
                      icon={
                        <Badge badgeContent={unreadMessageCount} color="primary">
                          <Avatar variant="rounded">
                            <CldImage width="50" height="50" src={`/Users/${user.image}`} alt={user.image}/>
                          </Avatar>
                        </Badge>
                      }
                      tooltipTitle={user.name}
                      onClick={() => handleUserClick(user._id)}
                    />
                  );
                })}

              <SpeedDialAction
                icon={
                  <Badge badgeContent={unreadMessageGroup} color="primary">
                    <Avatar variant="rounded">
                      <GroupIcon width="50" height="50"/>
                    </Avatar>
                  </Badge>
                }
                tooltipTitle="Group Chat"
                onClick={() => handleUserClick("Group")}
              />
            </SpeedDial>

          </div>

          <div className={styles.messagesContainer}>
              <div className={styles.spacer}></div>
              
              {messageList.map((message, index) => {
                  const sender = userList.find(user => user._id === message.ID_Sent);
                  return (
                      <div key={index} className={message.ID_Sent === myID ? styles.myMessage : styles.otherMessage}>
                          <div className={styles.options}>
                              <MessageOptions messageId={message._id} deleteMessage={deleteMessageById} />
                          </div>
                          {sender && 
                              <div className={styles.senderName} style={{ display: "flex", alignItems: "center" }}>
                                  <CldImage width="25" height="25" src={`/Users/${sender.image}`} alt={sender.image} style={{ borderRadius: "50%" }} /> 
                                  <span style={{ marginLeft: "10px" }}>{sender.nom} {sender.prenom}</span>
                              </div>
                          }
                          <div className={styles.content}>{message.Message}</div>
                      </div>
                  );
              })}

          </div>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className={styles.inputContainer}
          >
              <input
                type="text"
                className={styles.messageInput}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
              />
              <button className={styles.sendButton} type="submit">Send</button>
          </form>
          </div>
  );
};

export default MessagesPage;