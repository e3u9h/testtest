import { useState, useEffect } from 'react';
import UserListView from './components/User';
import { TweetListView } from './components/Tweet';
import InfiniteScroll from 'react-infinite-scroll-component';
import { randomSelect } from './utils/Utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from './provider/context';
import { Dropdown } from 'react-bootstrap';
import { ButtonGroup } from '@material-ui/core';
import Button from 'react-bootstrap/Button';
import { PlusOutlined } from '@ant-design/icons';
import { Image, Upload, Form, Input } from 'antd';
import { Row, Col } from 'antd';
import './css/custom-input.css';
import request from './utils/request';

// use of existing code: for image uploading and preview in NewPost, we referred to the sample code in the documentation of antd: https://ant.design/components/upload-cn
function NewPost() {
  const { username } = useAuth();
  const [availableTags, setAvailableTags] = useState([]);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [privacy, setPrivacy] = useState('false');
  const [fileList, setFileList] = useState([]);
  const [postContent, setPostContent] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const fetchAvailableTags = () => {
    request.get('tags')
      .then(res => {
        const fetchedTags = res.data.map((item) => item['tag']);
        setAvailableTags(fetchedTags);
      })
      .catch(err => {
        console.log(err);
      });
  }

  // convert a file to a Base64 string
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
      setPreviewImage(file.url || file.preview)
      setPreviewOpen(true);
    }
  }

  // Updates the fileList state with a new value
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  // define the upload button
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: 'none'
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  // Post
  const postNewTweet = () => {
    // Not allowed to post blank post.
    if (postContent.trim() == '') {
      alert('Can not publish an empty post! Say someting please!');
      return;
    }

    // print fileList
    console.log(fileList)

    // send data to server
    // format like label:data
    let formData = new FormData();
    formData.append('username', username)
    formData.append('tweet_content', postContent);
    tags.forEach(tag => {
      formData.append('tags', tag);
    });
    formData.append('private', privacy);

    fileList.forEach((file) => {
      formData.append('files', file.originFileObj)
    });

    request.post('new-tweet', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(res => {
      if (res.status === 201) {
        setPostContent(""); // clear post content
        setTags([]); // clear tags
        alert("Post success");
        window.location.reload(true); // reload the website
      } else {
        alert("Post failed");
      }
    }).catch(error => {
      console.error('Error:', error);
      alert("Post failed with error");
    });
  };

  // If the tag is not exist, use this function create a new tag
  const addNewTags = () => {
    console.log(newTag);
    if (!availableTags.includes(newTag)) {
      request.post('new-tag', { tag: newTag })
        .then(res => {
        if (res.status === 201) {
          console.log("New tag is inserted");
        } else if (res.status === 400) {
          console.log("Tag already exists");
        } else {
          console.log("Failed to insert new tag");
        }
          setTags([...tags, newTag]);
        document.getElementById("close-modal").click();
      });
    } else {
      setTags([...tags, newTag]);
      document.getElementById("close-modal").click();
    }
    setNewTag('');
  }


  return (
    <div className='container-fluid'>
      <div className='card p-2 m-2 mb-4' style={{ borderRadius: '25px' }}>
        <div className='card-body p-1 mx-1 mb-2 row'>
          <Form>
            <Form.Item>
              <Input.TextArea
                className="custom-input"
                rows={10}
                value={postContent}
                onChange={e => setPostContent(e.target.value)}
                placeholder="What do you want to share?"
              />
            </Form.Item>

            <Row justify="space-between" align="stretch">
              <Col>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start' }}>
                  <Form.Item>
                    <Upload
                      listType="picture-card"
                      fileList={fileList}
                      onPreview={handlePreview}
                      beforeUpload={(file) => {
                        setFileList((prevFileList) => [...prevFileList, file]);
                        return false;
                      }}
                      onChange={handleChange}
                    >
                      {fileList.length >= 8 ? null : uploadButton}
                    </Upload>
                    {previewImage && (
                      <Image
                        wrapperStyle={{
                          display: 'none',
                        }}
                        preview={{
                          visible: previewOpen,
                          onVisibleChange: (visible) => setPreviewOpen(visible),
                          afterOpenChange: (visible) => !visible && setPreviewImage(''),
                        }}
                        src={previewImage}
                      />
                    )}
                  </Form.Item>
                </div>
              </Col>

              <Col>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                  <div>
                    {tags != undefined && tags.map((tag, index) => {
                      return (
                        <span className="badge bg-secondary my-1 mx-2" key={index}>{tag}</span>
                      );
                    })}
                    <button type='button' className='btn btn-outline-secondary mx-2' data-bs-toggle="modal" data-bs-target="#add-tag" data-bs-whatever="@mdo" onClick={() => { fetchAvailableTags(); }}>Add Tag</button>
                  </div>

                  <Dropdown as={ButtonGroup}>
                    <Button type="button" varient='secondary' id='privacy' className="btn btn-secondary mx-2" onClick={postNewTweet}>{privacy === 'true' ? "New Private Post" : "New Public Post"}</Button>
                    <Dropdown.Toggle split variant="secondary" id="dropdown-split-privacy" style={{ borderTopRightRadius: '6px', borderBottomRightRadius: '6px' }}/>
                    <Dropdown.Menu style={{ borderRadius: '6px'}}>
                      <Dropdown.Item onClick={() => setPrivacy('false')}>Public</Dropdown.Item>
                      <Dropdown.Item onClick={() => setPrivacy('true')}>Private</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
      </div>

            {/* Modal */}
            <div className="modal fade" id="add-tag" tabIndex="-1" aria-labelledby="addTagModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addTagModalLabel">Select or Create New Tags</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="available-tags mb-3">
                {randomSelect(availableTags, 5).map((tag, index) => (
                  <button
                    key={index}
                    type="button"
                    className="btn btn-outline-secondary m-1"
                    data-bs-dismiss="modal"
                    onClick={() => setTags([...tags, tag])}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <div className="input-group">
                <input
                  type="text"
                  id="new-tag"
                  className="form-control"
                  placeholder="Enter new tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={addNewTags}
                >
                  Add
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                id="close-modal"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



function Main() {
  const { username } = useAuth();
  const [viewMode, setViewMode] = useState("following");
  const [recommendUsers, setRecommendUsers] = useState([]);
  const [recommendTweets, setRecommendTweets] = useState([]);
  const [followingsTweets, setFollowingsTweets] = useState([]);
  const [dataLength, setDataLength] = useState(0);
  const fetchFollowingsTweet = () => {
    console.log("hereFollowings tweets");
    request.get('followings/' + username)
      .then((res) => {
      if (res.status === 200) {
        return res.data;
      }
    }).then((data) => {
      console.log(data);
      setFollowingsTweets(data);
    }).catch((err) => {
      console.log(err);
    });
  }

  const fetchRecommendUsers = () => {
    request.get('users/' + username)
      .then((res) => res.data).then((data) => {
        console.log("Recommend users");
        console.log(data);
        setRecommendUsers(randomSelect(data, 6));
      }).catch((err) => {
        console.log(err);
      });
  }

  const fetchRecommendTweets = () => {
    console.log("hereRecommend tweets");
    request.get('tweets/' + username)
      .then((res) => res.data).then((data) => {
        console.log("Recommend tweets");
        console.log(data);
        const newData = randomSelect(data, 12)
        setRecommendTweets(newData);
        console.log(newData);
      }).catch((err) => {
        console.log(err);
      });
  }


  useEffect(() => {
    if (viewMode === "following") {
      fetchFollowingsTweet();
      setDataLength(followingsTweets ? followingsTweets.length : 0);
    } else if (viewMode === "recommend") {
      refreshRecommend();
    }
  }, [viewMode]);


  const changeFollowingMode = () => {
    setViewMode("following");
  }

  const changeRecommendMode = () => {
    setViewMode("recommend");
  }

  const refreshRecommend = () => {
    fetchRecommendUsers();
    fetchRecommendTweets();
    const usersLength = recommendUsers ? Math.ceil(recommendUsers.length / 3) : 0;
    const tweetsLength = recommendTweets ? recommendTweets.length : 0;
    setDataLength(usersLength + tweetsLength);
  }


  return (<div>
    <div className="container-fluid" style={{ height: "90vh" }}>
      <div className="btn-group d-flex mb-3" role="group" aria-label="...">
        <button
          type="button"
          className={`btn btn-underline-only w-100 ${viewMode === 'following' ? 'active' : ''}`}
          onClick={changeFollowingMode}
        >
          Following
        </button>
        <button
          type="button"
          className={`btn btn-underline-only w-100 ${viewMode === 'recommend' ? 'active' : ''}`}
          onClick={changeRecommendMode}
        >
          Recommend
        </button>
      </div>
      <div id="scrollableDiv" style={{ height: "70vh", overflow: "auto" }}>
        <NewPost />
        <InfiniteScroll dataLength={dataLength} next={null} hasMore={false} loader={<h4>Loading...</h4>}
          endMessage={
            <div className="d-flex justify-content-end h-100">
              <p className="text-center mb-0 mx-auto">
                <b>Yay! You have seen it all</b>
              </p>
              {viewMode === "recommend" && (
                <button className="btn btn-secondary me-3" onClick={refreshRecommend}>
                  <FontAwesomeIcon icon={faRefresh} />
                </button>
              )}
            </div>
          }>
          {viewMode === "recommend" && <>
            <UserListView userInfos={recommendUsers} />
            <TweetListView tweetInfos={recommendTweets} />
          </>}
          {viewMode === "following" && <>
            <TweetListView tweetInfos={followingsTweets} />
          </>}
        </InfiniteScroll>
      </div>
    </div>
  </div >)
}

export default Main;
// employ claude3 to offer some idea