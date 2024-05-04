import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import {Link} from "react-router-dom";
// import MaterialIcon, {colorPalette} from 'material-icons-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { BACK_END } from './config';
import { useAuth } from './provider/context';
import { timeDisplay } from './utils/Utils';
import request from './utils/request';

const actionMap = {
    "like": "liked your post",
    'follow': "started following you",
    "comment": "commented on your post",
    "retweet": "reposted your post" 
}
    


const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const { username } = useAuth();

    const fetchNotification = async () => {
        // fetch notification
        const notification = await request.get("notification/" + username);
        let notificationRes = notification.data;
        console.log(notificationRes);
        setNotifications(notificationRes);
    }

    useEffect(() => {
        fetchNotification();
    }, []);

    return (
        <div className="row" style={{ borderRadius: "25px" }}>
            <div id="scrollableNotification" style={{ height: "70vh", overflow: "auto" }}>
                <InfiniteScroll dataLength={notifications.length} next={null} hasMore={false} scrollableTarget="scrollableNotification"
                    endMessage={<p style={{ textAlign: 'center' }}><b>No more notifications</b></p>} >
                    <NotificationListView notifications={notifications} />
                </InfiniteScroll>
            </div>
        </div>
    )
}


class NotificationListView extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div className='list-group w-auto'>
                {this.props.notifications.map((note,index)=>
                note.icon!="follow" ?
                <SingleNotification key={index} icon={note.icon} action={note.action} name={note.name} time={note.time} content={note.content} portrait={note.portrait}/>
                :
                <SingleNotification key={index} icon={note.icon} action={note.action} name={note.name} time={note.time} content={note.content} portrait={note.portrait}/>)
                }
                
            </div>
        )
    }
}

class SingleNotification extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div class="card list-group-item d-flex">
                <div class="card-body">
                    <div>
                    <img class="img d-inline-block m-2 rounded-circle" style={{width:"50px", height: "50px"}} src={BACK_END+this.props.portrait} alt="Card image cap"/>   
                        <p class="card-text d-inline-block m-2">{this.props.name} {actionMap[this.props.action]}</p>
                        <p style={{ display: 'inline-block', fontStyle: 'italic', fontWeight: 'bold' }}>{this.props.content}</p>
                    </div>
                    <p class="card-text text-right"><small class="text-muted">Last updated: {timeDisplay(this.props.time)} </small></p>
                </div>
                
            </div>
        )
    }
}

export {Notification, SingleNotification};
