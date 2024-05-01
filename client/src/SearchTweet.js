import React, { useEffect } from 'react';
import { TweetListView } from './components/Tweet';
import InfiniteScroll from 'react-infinite-scroll-component';
import BackButton from './components/backbutton';
import request from './utils/request';

class SearchTweet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tag: window.location.pathname.split('/')[2],
      tweetList: [],
    };
  }

  componentDidMount() {
    this.getAllTweets();
  }

  async getAllTweets() {
    try {
      const res = await request.get('searchtag/' + this.state.tag, {
        headers: {
          'Accept': 'application/json',
        },
      });
      const tweetList = res.data;
      this.setState({ tweetList });
      console.log(this.state.tweetList);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  render() {
    return (
      <>
        <div className='row'>
          <BackButton />
        </div>
        <div id='scrollabletweets' style={{ height: '95vh', overflow: 'auto' }}>
          <InfiniteScroll
            dataLength={this.state.tweetList.length}
            next={null}
            hasMore={false}
            scrollableTarget='scrollabletweets'
            endMessage={<p style={{ textAlign: 'center' }}><b>No more Tweets</b></p>}
          >
            <TweetListView tweetInfos={this.state.tweetList} />
          </InfiniteScroll>
        </div>
      </>
    );
  }
}

export default SearchTweet;
    