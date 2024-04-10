import * as React from 'react';


const actionMap = {
    "like": "likes your tweet",
    'follow': "starts to follow you",
    "comment": "comments on your tweet",
    "retweet": "retweets your tweet" 
}

class Notification extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div>
            </div>
        )
    }

}

export {Notification};
