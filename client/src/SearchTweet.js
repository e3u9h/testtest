import React, { useEffect, useState } from 'react';
import { TweetListView } from './components/Tweet';
import InfiniteScroll from 'react-infinite-scroll-component';
import BackButton from './components/backbutton';
import request from './utils/request';
import { useParams } from 'react-router-dom';
import { useAuth } from './provider/context';

const fetchTweetsByTag = async (searchTag, currentUser, setTweets) => {
  try {
    const response = await request.get(`searchtag/${searchTag}/${currentUser}`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    setTweets(response.data);
  } catch (error) {
    console.error('Failed to fetch tweets:', error);
  }
};

const SearchTweet = () => {
  const { tag: searchTag } = useParams();
  const [tweets, setTweets] = useState([]);
  const { username: currentUser } = useAuth();

  useEffect(() => {
    fetchTweetsByTag(searchTag, currentUser, setTweets);
  }, [searchTag, currentUser]);

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
          <p style={{ textAlign: 'center' }}>No tweets found for the tag.</p>
        )}
      </div>
    </div>
  );
};

export default SearchTweet;