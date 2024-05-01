import ChatOnline from "./components/chatOnline/ChatOnline";
import Conversation from "./components/conversations/Conversations";
import Message from "./components/message/Message";
import "./css/messenger.css"
import { useEffect, useRef, useState } from "react";
import { useAuth } from "./provider/context.js";
import { io } from "socket.io-client";
import { timeDifference } from "./utils/Utils.js"
import request from "./utils/request.js";

// 
export default function Messenger(state){
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [currentUser, setCurrentUser] = useState("");
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredConversations, setFilteredConversations] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const socket = useRef();
    const scrollRef = useRef();

  const { username: current_username } = useAuth();

    //   fetch user info use this line
    //   const response = (await fetch(BACK_END + "profile/" + username));
    //   const user = await response.json();

    
    useEffect(() => {
      socket.current = io("ws://localhost:8000");
      // socket.current = io("ws://10.13.189.122:8000");
        socket.current.on("getMessage", (data) => {
          setArrivalMessage({
            sender: data.senderId,
            text: data.text,
            createdAt: Date.now(),
          });
        });
      }, []);

    useEffect(() => {
        arrivalMessage &&
          currentChat?.members.includes(arrivalMessage.sender) &&
          setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage, currentChat]);

    useEffect(() => {
        const getConversations = async () => {
          try {
            const response = await (request.get("profile/" + current_username));
            const user = response.data;
            const res = await request.get("server/conversations/" + user.uid);
            setCurrentUser(user);
            setConversations(res.data);
          } catch (err) {
            console.log(err);
          }
        };
        getConversations();
      }, [current_username]);

    useEffect(() => {
        const getMessages = async () => {
          try {
            const res = await request.get("server/messages/" + currentChat?._id, {
              headers: {
                "Content-Type": undefined,
              },
            });
            setMessages(res.data);
          } catch (err) {
            console.log(err);
          }
        };
        getMessages();
      }, [currentChat]);
    console.log(currentChat);
    console.log(messages);

    useEffect(() => {
        socket.current.emit("addUser", currentUser.uid);
        socket.current.on("getUsers", (users) => {
          setOnlineUsers(
            currentUser.followings?.filter((f) => users.some((u) => u.userId === f))
          );
        });
      }, [currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = {
          sender: currentUser.uid,
          text: newMessage,
          conversationId: currentChat._id,
        };

        const receiverId = currentChat.members.find(
            (member) => member !== currentUser.uid
        );
      
        socket.current.emit("sendMessage", {
        senderId: currentUser.uid,
        receiverId,
        text: newMessage,
        });
      
        try {
          const res = await request.post("server/messages", message,);
            setMessages([...messages, res.data]);
            setNewMessage("");
        } catch (err) {
            console.log(err);
          }
        };

  const handleSearchChange = async (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      try {
        const response = await request.get("searchuser/" + currentUser.username + "/" + value.trim());
        const matchedUsers = response.data;
        const matchedUserIds = matchedUsers.map(user => user.uid);

        const newFilteredConversations = conversations.filter(conversation =>
          conversation.members.some(member => 
            matchedUserIds.includes(member) && member !== currentUser.uid
          )
        );
        setFilteredConversations(newFilteredConversations);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        // Handle errors, possibly by setting an error state
      }
    } else {
      setFilteredConversations([]);
    }
  };




  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
//   '/searchuser/:selfname/:targetname'
    return(
        <div className="Messenger">
            <div className="chatMenu">
                <div className="chatMenuWrapper">
                    <input placeholder="Search for friends" className="chatMenuInput" onChange={handleSearchChange}
                    value = {searchTerm} />
                        {conversations.map((c, index) => (
                        <div key={index} onClick={() => setCurrentChat(c)}>
                            <Conversation conversation={c} currentUsername={current_username}/>
                        </div>
                        ))}
                </div>
            </div>
            <div className="chatBox">
                <div className="chatBoxWrapper">
                    {currentChat ? (
                        <>
                            <div className="chatBoxTop" >
                                {messages.map((m, index) => (
                                    <div key ={index} >
                                    <div ref={scrollRef}>
                                    <Message message={m} own={m.sender === currentUser.uid} />
                                    </div>
                                    </div>
                                ))}
                            </div>
                            <div className="chatBoxBottom">
                                <textarea className="chatMessageInput" placeholder="Write something..."
                                onChange={(e) => setNewMessage(e.target.value)}
                                value = {newMessage} {...handleSubmit}
                                ></textarea>
                                <button className="chatSubmitButton" onClick={handleSubmit}>Send</button>
                            </div>
                        </> 
                        ) : (<span className="noCoversationText">Open a conversation here</span>)}
                </div>
            </div>
            <div className="chatOnline">
                <div className="chatOnlineWrapper">
                    <ChatOnline/>
                    <ChatOnline/>
                    <ChatOnline/>
                    <ChatOnline/>
                </div>
            </div>
            
        </div>
    )
}
