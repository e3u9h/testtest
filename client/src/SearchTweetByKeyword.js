import React, { useEffect, useState } from 'react';
import { TweetListView } from './components/Tweet';
import InfiniteScroll from 'react-infinite-scroll-component';
import BackButton from './components/backbutton';
import request from './utils/request';
import { useParams } from 'react-router-dom';
import { useAuth } from './provider/context';

// seacrh tweets by its keywords
function SearchTweetByKeyword() {
    const props = useParams();
    const [keyword, setKeyword] = useState(props.keyword);
    const [tweetList, setTweetList] = useState([]);
    const { username: selfname } = useAuth();
    const getAllTweets = async () => {
        try {
            const res = await request.get('searchtweet/' + keyword + "/" + selfname, {
                headers: {
                    'Accept': 'application/json',
                },
            });
            setTweetList(res.data);
            console.log(res.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    useEffect(() => {
        getAllTweets();
    }, []);

    return (
        <>
            <div className='row'>
                <BackButton />
            </div>
            <div id='scrollabletweets' style={{ height: "80vh", overflowY: "scroll" }}>
                <InfiniteScroll
                    dataLength={tweetList.length}
                    next={null}
                    hasMore={false}
                    scrollableTarget='scrollabletweets'
                    endMessage={<p style={{ textAlign: 'center' }}><b>No more Posts</b></p>}
                >
                    <TweetListView tweetInfos={tweetList} />
                </InfiniteScroll>
            </div>
        </>
    );
}

export default SearchTweetByKeyword;