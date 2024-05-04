import React, { useEffect, useState } from 'react';
import { TweetListView } from './components/Tweet';
import InfiniteScroll from 'react-infinite-scroll-component';
import BackButton from './components/backbutton';
import request from './utils/request';
import { useParams } from 'react-router-dom';
import { useAuth } from './provider/context';

const searchTweets = async (searchKeyword, currentUser, setTweets) => {
  try {
    const response = await request.get(`searchtweet/${searchKeyword}/${currentUser}`, {
      headers: {
        Accept: 'application/json',
      },
    });
    setTweets(response.data);
  } catch (error) {
    console.error('Failed to search tweets:', error);
  }
};

const SearchTweetByKeyword = () => {
  const { keyword: searchKeyword } = useParams();
  const [tweets, setTweets] = useState([]);
  const { username: currentUser } = useAuth();

  useEffect(() => {
    searchTweets(searchKeyword, currentUser, setTweets);
  }, [searchKeyword, currentUser]);

  return (
    <div>
      <BackButton />
      <div id="tweetScrollContainer" style={{ height: '80vh', overflowY: 'scroll' }}>
        {tweets.length > 0 ? (
          <InfiniteScroll
            dataLength={tweets.length}
            next={null}
            hasMore={false}
            scrollableTarget="tweetScrollContainer"
            endMessage={
              <p style={{ textAlign: 'center' }}>
                <b>No more Posts</b>
              </p>
            }
          >
            <TweetListView tweetInfos={tweets} />
          </InfiniteScroll>
        ) : (
          <p style={{ textAlign: 'center' }}>No tweets found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchTweetByKeyword;