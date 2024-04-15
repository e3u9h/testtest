import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Comment from './Comment';
import { TweetCard } from './components/Tweet';
import { BACK_END } from './App';
import { useAuth } from './provider/context';
import { timeDifference } from './Utils';

const TweetDetail = () => {
    const [tweetInfo, setTweetInfo] = useState({
        "tid": 0,
        "likeInfo": { likeCount: 0, bLikeByUser: false },
        "dislikeInfo": { dislikeCount: 0, bDislikeByUser: false },
        "user": { uid: 0 },
        "content": 'Loading',
        "files": [],
        "commentCount": 0,
        "retweetCount": 0,
        "time": "Loading",
        "portraitUrl": "Loading",
        "tags": []
    });
    const [commentInfo, setCommentInfo] = useState([]);
    const { username } = useAuth();

    const fetchTweetDetail = async () => {
        // fetch tweet info
        const tweetInfoRes = await fetch(BACK_END + 'fetchtweet/' + window.location.pathname.split('/')[2] + '/' + username, {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json', 
            }
        }).then(res => res.json());

        setTweetInfo(tweetInfoRes);

        // fetch comment info
        const commentInfoRes = await fetch(BACK_END + 'tweet/' + window.location.pathname.split('/')[2] + '/comment', {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(res => res.json());

        setCommentInfo(commentInfoRes);
    }

    useEffect(() => {
        fetchTweetDetail();
    }, []);

    const addReply = async (clicked_floor) => {
        let newcommentId = "new-comment" + clicked_floor;
        let newCom = {
            content: document.getElementById(newcommentId).value,
            username: username,
            tid: window.location.pathname.split('/')[2],
            floor_reply: clicked_floor
        };
        console.log(newCom);
        let com = await fetch(BACK_END + 'tweet/reply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCom),
        });
        if (com.status === 403) {
            com.text().then(text => alert(text));
        } else {
            let com_res = await com.json();
            console.log(com_res);
            let new_comments = [...commentInfo, { floor: com_res.floor, username: com_res.username, content: com_res.content, portrait: com_res.portrait, time: timeDifference(com_res.time) }];
            setCommentInfo(new_comments);
            setTweetInfo({ ...tweetInfo, commentCount: tweetInfo.commentCount + 1 });
            console.log(commentInfo);
            document.getElementById(newcommentId).value = '';
        }
    }

    const addComment = async () => {
        let newCom = {
            content: document.getElementById('new-comment' + tweetInfo.tid).value,
            username: username,
            tid: window.location.pathname.split('/')[2],
        };
        console.log(newCom);
        let com = await fetch(BACK_END + 'tweet/comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCom),
        });
        if (com.status === 403) {
            com.text().then(text => alert(text));
        } else {
            let com_res = await com.json();
            console.log(com_res);
        let new_comments = [...commentInfo, { floor: com_res.floor, username: com_res.username, content: com_res.content, portrait: com_res.portrait, time: "Just now" }];
        console.log(new_comments)
            setCommentInfo(new_comments);
            let com_count = tweetInfo.commentCount + 1
            setTweetInfo({ ...tweetInfo, commentCount: com_count });
            console.log(commentInfo);
            document.getElementById('new-comment' + tweetInfo.tid).value = '';
        }
    }

    return (
        <div>
            <div id="scrollableComment" style={{ height: "80vh", overflow: "auto" }}>
                <InfiniteScroll dataLength={commentInfo.length} next={null} hasMore={false} scrollableTarget="scrollableComment"
                    endMessage={<p style={{ textAlign: 'center' }}><b>No more comments</b></p>}>
                    <TweetCard tweetInfo={tweetInfo} addComment={addComment} />
                    <div className="list-group w-auto" style={{ borderRadius: "25px" }}>
                        {commentInfo.map((comment, index) =>
                            <Comment addReply={addReply} key={index} name={comment.username} content={comment.content} portrait={comment.portrait} time={comment.time} floor={comment.floor} tid={tweetInfo.tid} />
                        )}
                    </div>
                </InfiniteScroll>
            </div>
        </div>
    )
}

export default TweetDetail;