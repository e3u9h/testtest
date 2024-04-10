import React from 'react';
import { TweetListView } from './Tweet';
import UserListView from './User';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useState, useRef } from 'react';
import { BACK_END } from './App';



class SearchTweetByKeyword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: window.location.pathname.split('/')[2],
            tweetList: []
        };
    }
    // get all the required tweets
    async getAllTweets() {
        console.log("keyword: " + this.state.keyword);
        let res = await fetch(BACK_END + 'searchtweet/' + this.state.keyword, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        let l = await res.json();
        this.state.tweetList = await l;
        this.setState((prevState) => ({ tweetList: l }));
        console.log(this.state.tweetList);
    }
    componentWillMount() {
        this.getAllTweets()
    }

    render() {
        return (
            <>

                <div id='scrollabletweets' style={{ height: "80vh", overflow: "auto" }}>
                    <InfiniteScroll dataLength={this.state.tweetList.length} next={null} hasMore={false} scrollableTarget="scrollabletweets"
                        endMessage={<p style={{ textAlign: 'center' }}><b>No more Tweets</b></p>}>

                        <TweetListView tweetInfos={this.state.tweetList} />
                    </InfiniteScroll>
                </div>
            </>
        )
    }
}

export default SearchTweetByKeyword;