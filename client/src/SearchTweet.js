import React, { useEffect } from 'react';
import { TweetListView } from './Tweet';
import InfiniteScroll from 'react-infinite-scroll-component';
import { BACK_END } from './App';

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
      const res = await fetch(BACK_END + 'searchtag/' + this.state.tag, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      const tweetList = await res.json();
      this.setState({ tweetList });
      console.log(this.state.tweetList);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  render() {
    return (
      <>
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
    