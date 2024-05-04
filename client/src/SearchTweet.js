import React, { useEffect, useState } from 'react';
import { TweetListView } from './components/Tweet';
import InfiniteScroll from 'react-infinite-scroll-component';
import BackButton from './components/backbutton';
import request from './utils/request';
// search post by tag
const SearchTweet = () => {
  const [tag, setTag] = useState(window.location.pathname.split('/')[2]);
  const [tweetList, setTweetList] = useState([]);

  useEffect(() => {
    getAllTweets();
  }, [tag]);

  const getAllTweets = async () => {
    try {
      const res = await request.get(`searchtag/${tag}`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      const newTweetList = res.data;
      setTweetList(newTweetList);
      console.log(newTweetList);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <div className='row'>
        <BackButton />
      </div>
      <div id='scrollabletweets' style={{ height: '95vh', overflow: 'auto' }}>
        <InfiniteScroll
          dataLength={tweetList.length}
          next={() => {}}
          hasMore={false}
          scrollableTarget='scrollabletweets'
          endMessage={<p style={{ textAlign: 'center' }}><b>No more Tweets</b></p>}
        >
          <TweetListView tweetInfos={tweetList} />
        </InfiniteScroll>
      </div>
    </>
  );
};

export default SearchTweet;