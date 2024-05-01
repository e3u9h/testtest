import { useEffect, useState } from "react";
import "./conversation.css";
import axios from "axios";
import React from "react";
import { BACK_END } from "../../App";
import request from "../../utils/request";

export default function Conversation({ conversation , currentUsername}) {
  const [user, setUser] = useState(null);

//problem here
  useEffect(() => {
    const getUser = async () => {
      try {        
        const response = await (request.get("profile/" + currentUsername));
        const currentUser = response.data;
        const friendId = conversation.members.find((m) => m !== currentUser.uid);
        const res = await request.get("auser/" + friendId);
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
