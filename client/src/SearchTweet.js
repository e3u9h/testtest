import React, { useEffect, useState } from 'react';
import { TweetListView } from './components/Tweet';
import InfiniteScroll from 'react-infinite-scroll-component';
import BackButton from './components/backbutton';
import request from './utils/request';
import { useParams } from 'react-router-dom';
import { useAuth } from './provider/context';

const SearchTweet = () => {
  const { tag: tagParam } = useParams();
  const [tweets, setTweets] = useState([]);
  const { username: currentUser } = useAuth();

  useEffect(() => {
    const fetchTweetsByTag = async () => {
      try {
        const response = await request.get(`searchtag/${tagParam}/${currentUser}`, {
          headers: {
            'Accept': 'application/json',
          },
        });
        setTweets(response.data);
      } catch (error) {
        console.error('Failed to fetch tweets:', error);
      }
    };

    fetchTweetsByTag();
  }, [tagParam, currentUser]);

  return (
    <div>
      <BackButton />
      <div id='tweetContainer' style={{ height: "80vh", overflowY: "scroll" }}>
        {tweets.length > 0 ? (
          <InfiniteScroll
            dataLength={tweets.length}
            next={null}
            hasMore={false}
            scrollableTarget='tweetContainer'
            endMessage={<p style={{ textAlign: 'center' }}><b>No more Posts</b></p>}
          >
            <TweetListView tweetInfos={tweets} />
          </InfiniteScroll>
        ) : (
          <p style={{ textAlign: 'center' }}>No tweets found for the tag.</p>
        )}
      </div>
    </div>
  );
}

export default SearchTweet;