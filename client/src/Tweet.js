import { faThumbsUp, faThumbsDown, faComment, faRetweet, faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


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

  





  


  return (
    <div className="card p-2 m-2 mb-4" style={{ borderRadius: "30px" }}>
    </div>
  )
}

function TweetListView({ tweetInfos }) {
  return (
    <>
    </>)
}

export { TweetListView, TweetCard };