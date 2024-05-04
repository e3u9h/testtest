import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Comment from './components/Comment';
import { TweetCard } from './components/Tweet';
import { useAuth } from './provider/context';
import { timeDisplay } from './utils/Utils';
import request from './utils/request';
import BackButton from './components/backbutton';
import { useParams } from 'react-router-dom';

// Declaration: we use poe.com to generate some code and fix some bugs in this file

const TweetDetail = () => {
    const { tweetid } = useParams();
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
        const tweetInfoRes = await request.get("fetchtweet/" + window.location.pathname.split('/')[2] + "/" + username)

        setTweetInfo(tweetInfoRes.data);

        // fetch comment info
        const commentInfoRes = await request.get("tweet/" + window.location.pathname.split('/')[2] + "/comment")

        setCommentInfo(commentInfoRes.data);
    }

    useEffect(() => {
        fetchTweetDetail();
    }, []);

    const addReply = async (clicked_floor, content) => {
        let newcommentId = "new-comment" + clicked_floor;
        let newCom = {
            content: content,
            username: username,
            tid: tweetid,
            floor_reply: clicked_floor
        };
        console.log(newCom);
        try {
            const com = await request.post("tweet/reply", newCom);
            let com_res = com.data;
            console.log(com_res);
            let new_comments = [...commentInfo, { floor: com_res.floor, username: com_res.username, content: com_res.content, portrait: com_res.portrait, time: timeDisplay(com_res.time) }];
            setCommentInfo(new_comments);
            setTweetInfo({ ...tweetInfo, commentCount: tweetInfo.commentCount + 1 });
            console.log(commentInfo);
            document.getElementById(newcommentId).value = '';
        }
        catch (err) {
            if (err.response.status === 403) {
                alert(err.response.data);
            } else {
                console.log(err);
            }
        }
    }

    const addComment = async (content) => {
        let newCom = {
            content: content,
            username: username,
            tid: tweetid,
        };
        console.log(newCom);
        try {
            const com = await request.post("tweet/comment", newCom);
            let com_res = com.data;
            console.log(com_res);
            let new_comments = [...commentInfo, { floor: com_res.floor, username: com_res.username, content: com_res.content, portrait: com_res.portrait, time: "Just now" }];
            console.log(new_comments)
            setCommentInfo(new_comments);
            let com_count = tweetInfo.commentCount + 1
            setTweetInfo({ ...tweetInfo, commentCount: com_count });
            console.log(commentInfo);
        }
        catch (err) {
            if (err.response.status === 403) {
                alert(err.response.data);
            } else {
                console.log(err);
            }
        }
    }

    return (
        <div>
            <BackButton />
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