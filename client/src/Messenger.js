import ChatOnline from "./components/chatOnline/ChatOnline";
import Conversation from "./components/conversations/Conversations";
import Message from "./components/message/Message";
import "./css/messenger.css"
import { useEffect, useRef, useState } from "react";
import { getLoginInfo } from './Login';
import axios from "axios";
import { BACK_END } from "./App";
import { io } from "socket.io-client";
import { timeDifference } from "./Utils.js"

// 
export default function Messenger(){
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [currentUser, setCurrentUser] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const socket = useRef();
    const scrollRef = useRef();

    const current_username = getLoginInfo()['username'];

    //   fetch user info use this line
    //   const response = (await fetch(BACK_END + "profile/" + username));
    //   const user = await response.json();

    useEffect(() => {
        const getConversations = async () => {
          try {
            const response = await (fetch(BACK_END + "profile/" + current_username));
            const user = await response.json();
            const res = await axios.get(BACK_END+"server/conversations/" + user.uid);
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
            const res = await axios.get(BACK_END+ "server/messages/" + currentChat?._id);
            setMessages(res.data);
          } catch (err) {
            console.log(err);
          }
        };
        getMessages();
      }, [currentChat]);
    console.log(currentChat);
    console.log(messages);

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
      
        //   socket.current.emit("sendMessage", {
        //     senderId: currentUser.uid,
        //     receiverId,
        //     text: newMessage,
        //   });
      
          try {
            const res = await axios.post(BACK_END + "server/messages", message);
            setMessages([...messages, res.data]);
            setNewMessage("");
          } catch (err) {
            console.log(err);
          }
        };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

    return(
        <div className="Messenger">
            <div className="chatMenu">
                <div className="chatMenuWrapper">
                    <input placeholder="Search for friends" className="chatMenuInput" />
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
                            <div className="chatBoxTop">
                                {messages.map((m, index) => (
                                    <div key ={index} ref={scrollRef}>
                                    <Message message={m} own={m.sender === currentUser.uid} />
                                    </div>
                                ))}
                            </div>
                            <div className="chatBoxBottom">
                                <textarea className="chatMessageInput" placeholder="Write something..."
                                onChange={(e) => setNewMessage(e.target.value)}
                                value = {newMessage}
                                ></textarea>
                                <button className="chatSubmitButton" onClick={handleSubmit}>Send</button>
                            </div>
                        </> 
                        ) : (<span className="noCovText" >Open a conversation here</span>)}
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
