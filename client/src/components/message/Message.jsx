import "./message.css";
import { format } from "timeago.js"
import { timeDisplay } from "../../utils/Utils.js"

export default function Message({message, own}) {
  return (
    <div className={own ? "message own" : "message"}>
        <div className="messageTop">
        <img
          className="messageImg"
          src="/logo192.png"
          alt=""
        />
        <p className="messageText">{message.text} </p>
        </div>
      <div className="messageBottom">{timeDisplay(message.createdAt)} </div>
    </div>
  );
}

//Referrence: https://github.com/safak/youtube/tree/chat-app by Lama Dev