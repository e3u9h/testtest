import { faThumbsUp, faThumbsDown, faComment, faRetweet, faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState, useRef } from 'react';
import { timeDifference } from '../utils/Utils';
import { Link } from "react-router-dom";
import { useAuth } from '../provider/context';
import { BACK_END } from '../config';
import { randomSelect } from '../utils/Utils';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { Image, Form, Input } from 'antd';
import request from '../utils/request';



function TweetCard({ tweetInfo, addComment, isDetailPage = true }) {
  const { username: selfname, mode } = useAuth();
  console.log("here1" + JSON.stringify(tweetInfo))
  const [likeInfo, setLikeInfo] = useState(tweetInfo['likeInfo']);
  const [dislikeInfo, setDislikeInfo] = useState(tweetInfo['dislikeInfo']);
  const [timeInterval, setTimeInterval] = useState(timeDifference(tweetInfo['time']));
  const [isReported, setIsReported] = useState(tweetInfo['isReported']);
  const [commentCount, setCommentCount] = useState(tweetInfo['commentCount']);
  const [retweetCount, setRetweetCount] = useState(tweetInfo['retweetCount']);
  const tweetContent = tweetInfo['content'];
  const portraitUrl = tweetInfo['portraitUrl'];
  const tags = tweetInfo['tags'];
  const username = tweetInfo['user']['username'];
  const files = tweetInfo['files']
  console.log("here2" + tweetContent + files + tweetInfo['files'])


  useEffect(() => {
    setLikeInfo(tweetInfo['likeInfo']);
    setDislikeInfo(tweetInfo['dislikeInfo']);
    setCommentCount(tweetInfo['commentCount']);
    setRetweetCount(tweetInfo['retweetCount']);
    setIsReported(tweetInfo['isReported']);
  }, [tweetInfo]);

  const clickLikeTweet = () => {
    if (likeInfo.bLikeByUser) {
      updateTweetInfo("cancel-like");
    } else {
      updateTweetInfo("like");
    }
  }

  const clickDislikeTweet = () => {
    if (dislikeInfo.bDislikeByUser) {
      updateTweetInfo("cancel-dislike");
    } else {
      updateTweetInfo("dislike");
    }
  }

  const updateTweetInfo = (operation) => {
    console.log("Updated tweet info to DB");
    request.put("tweet/" + tweetInfo['tid'] + "/" + selfname + "/" + operation)
      .then(res => {
        if (res.status === 201) {
          return res.data;
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

  const handleTweetReport = () => {
    request.put("tweet/" + tweetInfo['tid'] + "/" + selfname + "/report")
      .then(res => {
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

  const addCommentMain = () => {
    let newCom = {
      content: document.getElementById('new-comment' + tweetInfo.tid).value,
      username: selfname,
      tid: tweetInfo.tid,
    };
    console.log(newCom);
    request.post("tweet/comment", newCom)
      .then(response => {
        setCommentCount(commentCount + 1);
        return response.data;
      })
      .then(com_res => console.log(com_res))
      .catch(err => {
        if (err.response.status === 403) {
          alert(err.response.data);
        }
      });
    document.getElementById('new-comment' + tweetInfo.tid).value = '';
  }


  return (
    <div className="card p-2 m-2 mb-4" style={{ borderRadius: "25px" }}>
      <div className="card-body row flex-column">
        <div className="col-5">

          <div className="d-flex ">
            {/* link to the user profile */}
            <Link to={"/" + username}>
              <div className="rounded-circle overflow-hidden" style={{ width: "45px", height: "45px" }}>
                <img src={BACK_END + portraitUrl} alt="Generic placeholder image" className="img-fluid h-100 w-100" style={{ objectFit: 'cover' }} />
              </div>
            </Link>
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '-5px', marginLeft: '15px' }}>
              <h5 className="my-1">{username}</h5>
              <p className="opacity-50 text-nowrap text-center" style={{ fontSize: '14px', marginTop: '-5px' }}>{timeInterval}</p>
            </div>
            <div className="d-flex justify-content-start" style={{ marginLeft: '10px' }}>
              {tags.map((tag, index) => {
                if (tag) {
                  console.log("tag");
                  console.log(tag);
                  return (
                    <span key={index} style={{ color: '#6c757d', marginLeft: '5px' }}>#{tag}</span>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>


        <div className="col-12">
          <div className="row d-flex flex-column h-100">
            <div className="row flex-grow-1">

              <div><p>{tweetContent}</p></div>

              <div className="col-12 mb-2">
                <Image.PreviewGroup
                  preview={{
                    onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
                  }}
                >
                  {files.map((src, index) => (
                    <Image
                      key={index}
                      width={200}
                      src={BACK_END + src}
                      style={{ margin: '8px' }}
                    />
                  ))}
                </Image.PreviewGroup>
              </div>
            </div>

            <div className="d-flex align-items-end justify-content-end mt-autoo">
              {!isDetailPage && <span className="m-1">
                <Link to={"/tweet/" + tweetInfo["tid"]}>
                  <button type="button" className="btn btn-secondary btn-floating">View Full Post</button>
                </Link>
              </span>}
              {selfname && mode == 'user' &&
                <>
                  <span className="m-1">
                    <button type="button" className={"btn btn-" + (likeInfo.bLikeByUser ? "" : "outline-") + "secondary btn-floating"} onClick={clickLikeTweet}>
                      <FontAwesomeIcon icon={faThumbsUp}></FontAwesomeIcon>
                    </button>
                    <span className="ms-1 opacity-75">{likeInfo.likeCount}</span>
                  </span>
                  <span className="m-1">
                    <button type="button" className={"btn btn-" + (dislikeInfo.bDislikeByUser ? "" : "outline-") + "secondary btn-floating"} onClick={clickDislikeTweet}>
                      <FontAwesomeIcon icon={faThumbsDown}></FontAwesomeIcon>
                    </button>
                    <span className="ms-1 opacity-75">{dislikeInfo.dislikeCount}</span>
                  </span>
                  <span className="m-1">
                    <button type="button" className="btn btn-outline-secondary btn-floating" data-bs-toggle="modal" data-bs-target={"#tweetCommentForm" + tweetInfo.tid} data-bs-whatever="@mdo">
                      <FontAwesomeIcon icon={faComment}></FontAwesomeIcon>
                    </button>
                    <span className="ms-1 opacity-75">{commentCount}</span>
                  </span>
                  <span className="m-1">
                    <a className="btn btn-outline-secondary btn-floating" href={"#tweetForwardForm" + tweetInfo.tid} data-bs-toggle="modal" role='button'>
                      <FontAwesomeIcon icon={faRetweet}></FontAwesomeIcon>
                    </a>
                    <span className="ms-1 opacity-75" id='retweetCount'>{retweetCount}</span>
                  </span>
                  <span className="m-1">
                    <button type="button" className={"btn btn-floating" + (isReported ? "btn-secondary disabled" : " btn-outline-secondary")} data-bs-toggle="modal" data-bs-target={"#report-popup" + tweetInfo['tid']}>
                      <FontAwesomeIcon icon={faWarning}></FontAwesomeIcon>
                    </button>
                  </span>
                </>
              }
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <div className="modal fade" id={"report-popup" + tweetInfo['tid']} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel"><FontAwesomeIcon icon={faWarning}></FontAwesomeIcon>Warning</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              Are you sure to report this tweet?
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleTweetReport}>Yes</button>
            </div>
          </div>
        </div>
      </div>

      {/* comment form for tweet's comment*/}
      <div className="modal fade" id={"tweetCommentForm" + tweetInfo.tid} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5"> Post your comment from here </h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <textarea className="form-control" id={'new-comment' + tweetInfo.tid} rows='5'></textarea>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal"> Cancel </button>
              <button type="button" onClick={isDetailPage ? addComment : addCommentMain} className="btn btn-secondary" data-bs-dismiss="modal"> Send </button>
            </div>
          </div>
        </div>
      </div>

      {/* forward tweet */}
      <ForwardForm tid={tweetInfo.tid} retweetCount={retweetCount} setRetweetCount={setRetweetCount} />
    </div>
  )
}

function ForwardForm(props) {
  const { username: selfname } = useAuth();
  const initialContent = 'Repost';
  const [availableTags, setAvailableTags] = useState([]);
  const [tags, setTags] = useState([]);
  const [privacy, setPrivacy] = useState('false');
  const [repostContent, setRepostContent] = useState('')



  const fetchAvailableTags = () => {
    request.get("tags")
      .then(res => res.data).then(data => {
        const fetchedTags = data.map((item) => item['tag']);
        setAvailableTags(fetchedTags);
      }).catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchAvailableTags();
  }, []);


  const postRetweet = () => {
    if (repostContent === "") {
      setRepostContent(initialContent)
    }
    let postBody = {
      username: selfname,
      tweet_content: repostContent,
      tags: tags,
      tid: props.tid,
      private: privacy
    }
    console.log(postBody)

    request.post("retweet", postBody)
      .then(res => {
        console.log(res)
        if (res.status === 201) {
          setRepostContent(initialContent);
          props.setRetweetCount(props.retweetCount + 1);
          setTags([]);
          alert("Repost success");
        } else if (res.status === 403) {
          res.text().then(text => alert(text));
        }
        else {
          alert("Repost failed");
        }
      });
  };


  const addNewTags = () => {
    let newTagsDom = document.getElementById("new-tag-retweet" + props.tid);
    if (newTagsDom == null) {
      console.log("Error: newTagsDom is null");
      return;
    }
    console.log(newTagsDom);
    let newTags = newTagsDom.value;
    // check if the tag is already in the list
    if (!availableTags.includes(newTags)) {
      // insert the new tag into the database
      request.post("new-tag", { tag: newTags }).then(res => {
        if (res.status === 201) {
          console.log("New tag inserted");
        } else if (res.status === 202 && res.body === "Tag already exists") {
          // alert("Tag already exists");
          console.log("Tag already exists");
        } else {
          console.log("Failed to insert new tag");
        }
        setTags([...tags, newTags]);
        // close the modal
        document.getElementById("close-modal").click();
      });
    } else {
      alert("Tag already exists");
    }
    // clear the input field
    newTagsDom.value = '';
  }
  return (
    <div>
      <div className="modal fade" id={"tweetForwardForm" + props.tid} aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5"> Repost </h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <Form>
                <Form.Item>
                  <Input.TextArea
                    rows={4}
                    value={repostContent}
                    onChange={e => setRepostContent(e.target.value)}
                    placeholder="Say something when repost!"
                  />
                </Form.Item>
              </Form>
              <div className="modal-body">
                <h5>Choose a tag</h5>
                <hr></hr>
                {randomSelect(availableTags, 5).map((tag, index) => {
                  return (
                    <button type="button" className="btn btn-outline-secondary mx-2 my-1" key={index} onClick={() => setTags([...tags, tag])}>{tag}</button>
                  );
                })}
                <div>
                  <div className="input-group m-2">
                    <input type="text" id={"new-tag-retweet" + props.tid} className="form-control" placeholder="Input new tags" aria-label="Input new tags" aria-describedby="button-add" />
                    <button className="btn btn-outline-secondary" type="button" data-bs-target="#tweetForwardForm" onClick={addNewTags}>Add</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <div>
                {tags != undefined && tags.map((tag, index) => {
                  return (
                    <span className="badge bg-secondary my-1 mx-2" key={index}>{tag}</span>
                  );
                })}
              </div>
              <div>
                <Dropdown as={ButtonGroup}>
                  <Button type="button" varient='secondary' id='retweet-privacy' className="btn btn-secondary mx-2" onClick={postRetweet}>Send</Button>
                  <Dropdown.Toggle split variant="secondary" id="retweet-dropdown-split-privacy" />
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => { setPrivacy('false'); document.getElementById('retweet-privacy').innerHTML = "Send Public" }}>Public</Dropdown.Item>
                    <Dropdown.Item onClick={() => { setPrivacy('true'); document.getElementById('retweet-privacy').innerHTML = "Send Private"; console.log(privacy) }}>Private</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

function TweetListView({ tweetInfos }) {
  return (
    <>
      <div className="container-fluid">
        {tweetInfos.map((tweetInfo, index) =>
          <TweetCard tweetInfo={tweetInfo} isDetailPage={false} key={index} />
        )}
      </div >
    </>)
}

export { TweetListView, TweetCard };