import { faThumbsUp, faThumbsDown, faComment, faRetweet, faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { timeDifference } from './Utils';
import { Link } from "react-router-dom";
import { getLoginInfo } from './Login';
import { BACK_END } from './App';
import { randomSelect } from './Utils';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

export const tinyMCEApiKey = "sectfzujjivlo90kpiqptvlao0lrn8b79rf326hs1v6b9oyu"

function TweetCard({ tweetInfo, addComment, isDetailPage = true }) {
  const [likeInfo, setLikeInfo] = useState(tweetInfo['likeInfo']);
  const [dislikeInfo, setDislikeInfo] = useState(tweetInfo['dislikeInfo']);

  const [timeInterval, setTimeInterval] = useState(timeDifference(tweetInfo['time']));

  const [isReported, setIsReported] = useState(tweetInfo['isReported']);
  const [commentCount, setCommentCount] = useState(tweetInfo['commentCount']);
  const tweetContent = tweetInfo['content'];
  const [retweetCount, setRetweetCount] = useState(tweetInfo['retweetCount']);
  const portraitUrl = tweetInfo['portraitUrl'];
  const tags = tweetInfo['tags'];
  const username = tweetInfo['user']['username'];
  const files = tweetInfo['files']
  console.log("TWEETPART"+files)

  // Update time
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeInterval(timeDifference(tweetInfo['time']));
    }, 1000);
    return () => clearInterval(interval);
  });

  // Update component state based on tweetInfo changes
  useEffect(() => {
    setLikeInfo(tweetInfo['likeInfo']);
    setDislikeInfo(tweetInfo['dislikeInfo']);
    setCommentCount(tweetInfo['commentCount']);
    setRetweetCount(tweetInfo['retweetCount']);
    setIsReported(tweetInfo['isReported']);
  }, [tweetInfo]);

  // click like 
  const clickLikeTweet = () => {
    if (likeInfo.bLikeByUser) {
      updateTweetInfo("cancel-like");
    } else {
      updateTweetInfo("like");
    }
  }

  // click dislike
  const clickDislikeTweet = () => {
    if (dislikeInfo.bDislikeByUser) {
      updateTweetInfo("cancel-dislike");
    } else {
      updateTweetInfo("dislike");
    }
  }

  // update tweet info to database
  const updateTweetInfo = (operation) => {
    console.log("Updated tweet info to DB");
    fetch(BACK_END + 'tweet/' + tweetInfo['tid'] + "/" + getLoginInfo()['username'] + "/" + operation, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(res => {
      if (res.status === 201) {
        return res.json();
      } else {
        console.log("Like tweet failed");
        throw new Error("Like tweet failed");
      }
    }).then(data => {
      setLikeInfo(data['likeInfo']);
      setDislikeInfo(data['dislikeInfo']);
    }).catch(err => {
      console.log(err);
    });
  }

  // send report info to backend
  const handleTweetReport = () => {
    fetch(BACK_END + 'tweet/' + tweetInfo['tid'] + "/" + getLoginInfo()['username'] + "/report", {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(res => {
      if (res.status === 201) {
        console.log("Report tweet success");
        setIsReported(true);
      } else {
        console.log("Report tweet failed");
      }
    }).catch(err => {
      console.log(err);
    });
  }

  // Add comment to backend
  const addCommentMain = () => {
    let newCom = {
      content: document.getElementById('new-comment' + tweetInfo.tid).value,
      username: getLoginInfo().username,
      tid: tweetInfo.tid,
    };
    console.log(newCom);
    fetch(BACK_END + 'tweet/comment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCom),
    }).then(com => com.json()).then(com_res =>
      console.log(com_res));
    document.getElementById('new-comment' + tweetInfo.tid).value = '';
    setCommentCount(commentCount + 1);
  }

}