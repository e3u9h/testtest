import React from 'react';
import { TweetListView } from './components/Tweet';
import UserListView from './components/User';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useState, useRef } from 'react';
import { BACK_END } from './App';
import BackButton from './components/backbutton';
import request from './utils/request';



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
        const res = await request.get('searchtweet/' + this.state.keyword, {
            headers: {
                'Accept': 'application/json',
            },
        });
        const tweetList = res.data;
        this.setState({ tweetList });
        console.log(this.state.tweetList);
    }
    componentWillMount() {
        this.getAllTweets()
    }

    render() {
        return (
            <>
                <div className='row'>
                    <BackButton />
                </div>
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