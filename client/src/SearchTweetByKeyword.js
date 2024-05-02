import React from 'react';
import { TweetListView } from './components/Tweet';
import InfiniteScroll from 'react-infinite-scroll-component';
import BackButton from './components/backbutton';
import request from './utils/request';


// seacrh tweets by its keywords
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