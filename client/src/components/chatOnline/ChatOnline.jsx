import "./chatOnline.css"


export default function ChatOnline(){
    return(
        <div className="chatOnline">
            <div className="friend">
                <div className="ImgContainer">
                    <img className="chatOnlineImg" src="/logo192.png" alt="" />
                    <div className="chatOnlineBadge"></div>
                </div>
                <span className="chatOnlineName">Peter</span>
            </div>
        </div>
    )

}