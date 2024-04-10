import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import {Link} from "react-router-dom";
// import MaterialIcon, {colorPalette} from 'material-icons-react';
import ChatBox from './Chat';
import InfiniteScroll from 'react-infinite-scroll-component';
import {BACK_END} from './App';
import { getLoginInfo } from './Login';
import { timeDifference } from './Utils';

const actionMap = {
    "like": "liked your tweet",
    'follow': "started following you",
    "comment": "commented on your tweet",
    "retweet": "reposted your tweet" 
}
    


class Notification extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            viewMode:"notification",
            notifications: []
        }; // two viewmode, notification or message
        
    }

    async fetchNotification(){
        // fetch notification
        let notification = await fetch(BACK_END+'notification/'+getLoginInfo().username, {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
            }
        });
        let notificationRes = await notification.json();
        console.log(notificationRes);
        this.setState({notifications: notificationRes},()=>console.log(this.state.notifications));
    }

    componentWillMount(){
        this.fetchNotification();
    }



    render(){
        return(
            <div className="row" style = {{borderRadius: "25px" }}>
                <div id="scrollableNotification" style={{ height: "70vh", overflow: "auto"}}>
                    {this.state.viewMode == "notification" && 
                        <InfiniteScroll dataLength={this.state.notifications.length} next={null} hasMore={false} scrollableTarget="scrollableNotification"
                            endMessage={<p style={{ textAlign: 'center' }}><b>No more notifications</b></p>} >
                            <NotificationListView notifications={this.state.notifications}/>
                        </InfiniteScroll>
                    }
                    {this.state.viewMode == "message" && <MessageView />}
                </div>  
            </div>
        )
    }
}

class MessageView extends React.Component{
    render(){
        return(
            <div><ChatBox/></div>
        )
    }
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
                    <p class="card-text text-right"><small class="text-muted">Last updated: {timeDifference(this.props.time)} </small></p>
                </div>
                
            </div>
        )
    }
}

export {Notification, SingleNotification};
