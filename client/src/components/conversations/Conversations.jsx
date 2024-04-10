import { useEffect, useState } from "react";
import "./conversation.css";
import axios from "axios";
import React from "react";
import { BACK_END } from "../../App";

export default function Conversation({ conversation , currentUsername}) {
  const [user, setUser] = useState(null);

//problem here
  useEffect(() => {
    const getUser = async () => {
      try {        
        const response = await (fetch(BACK_END + "profile/" + currentUsername));
        const currentUser = await response.json();
        const friendId = conversation.members.find((m) => m !== currentUser.uid);
        const res = await axios(BACK_END+ "auser/" + friendId);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUsername, conversation]);

  return (
    <div className="conversation">
      <img className="conversationImg" src={BACK_END + user?.portrait} alt="" />
        <span className="conversationName">{user?.username}</span>
    </div>
  );
}
