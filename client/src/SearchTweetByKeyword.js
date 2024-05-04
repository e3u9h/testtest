import React, { useEffect, useState } from 'react';
import { TweetListView } from './components/Tweet';
import InfiniteScroll from 'react-infinite-scroll-component';
import BackButton from './components/backbutton';
import request from './utils/request';
import { useParams } from 'react-router-dom';
import { useAuth } from './provider/context';

const SearchTweetByKeyword = () => {
  const { keyword } = useParams();
  const [tweetList, setTweetList] = useState([]);
  const { username: selfname } = useAuth();

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const response = await request.get(`searchtweet/${keyword}/${selfname}`, {
          headers: {
            'Accept': 'application/json',
          },
        });
        setTweetList(response.data);
      } catch (error) {
        console.error('Error fetching tweets:', error);
      }
    };

    fetchTweets();
  }, [keyword, selfname]);

  return (
    <div>
      <BackButton />
      <div id='scrollabletweets' style={{ height: '80vh', overflowY: 'scroll' }}>
        {tweetList.length > 0 ? (
          <InfiniteScroll
            dataLength={tweetList.length}
            next={() => {}}
            hasMore={false}
            scrollableTarget='scrollabletweets'
            endMessage={<p style={{ textAlign: 'center' }}><b>No more Posts</b></p>}
          >
            <TweetListView tweetInfos={tweetList} />
          </InfiniteScroll>
        ) : (
          <p style={{ textAlign: 'center' }}>No tweets found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchTweetByKeyword;