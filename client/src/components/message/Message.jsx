import "./message.css";
import { format } from "timeago.js"
import { timeDifference } from "../../Utils.js"

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
        <div className="messageBottom">{timeDifference(message.createdAt)} </div>
    </div>
  );
}