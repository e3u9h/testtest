import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { Link, useParams, useNavigate } from 'react-router-dom'
import { TweetListView } from './components/Tweet';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAuth } from './provider/context';
import { faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BACK_END } from './config';
import "./css/profile.css"
import BackButton from './components/backbutton';
import request from './utils/request';

function Profile() {
    const { username, mode } = useAuth();
    const props = useParams();
    const [viewMode, setViewMode] = useState("MyPosts");
    const [self, setSelf] = useState({
        uid: "Loading",
        username: username,
        followings: "Loading",
        users_blocked: "Loading",
        users_reported: "Loading"
    });
    const [target, setTarget] = useState({
        uid: "Loading",
        username: props.username,
        gender: "Loading",
        following_counter: "Loading",
        follower_counter: "Loading",
        users_blocked: "Loading",
        about: "Loading",
        portrait: "Loading"
    });
    const [follow, setFollow] = useState(false);
    const [block, setBlock] = useState(false);
    const [beblocked, setBeblocked] = useState(false);
    const [report, setReport] = useState(false);
    const [textAreaValue, setTextAreaValue] = useState("");
    const [editgender, setEditgender] = useState(target.gender);
    const navigate = useNavigate();

    const fetchInfo = async () => {

        // Fetch target information
        const responseTarget = await request.get("profile/" + target.username, {
            headers: { 'Accept': 'application/json' }
        });
        const dataTarget = responseTarget.data;
        console.log("TARGET:");
        console.log(dataTarget);

        setTarget(dataTarget);
        setTextAreaValue(dataTarget.about);
        // Fetch self information
        if (mode === 'user') {
            const responseSelf = await request.get("profile/" + self.username + "/actioninfo", {
                headers: { 'Accept': 'application/json' }
            });
            const dataSelf = responseSelf.data;
            setSelf(dataSelf);
            console.log(dataSelf);
            console.log(dataSelf.users_blocked);
            // Follow, block, and report logic
            setFollow(dataSelf.followings.includes(dataTarget.uid));
            setBlock(dataSelf.users_blocked.includes(dataTarget.uid));
            console.log("here1111");
            console.log(dataSelf.users_blocked);
            setBeblocked(dataTarget.users_blocked.includes(dataSelf.uid));
            setReport(dataSelf.users_reported.includes(dataTarget.uid));
        }
    };

    useEffect(() => {
        fetchInfo();
    }, []);


    const handleFollowClick = async () => {
        const endpoint = follow ? 'unfollow' : 'follow';
        const response = await request.put("interaction/" + self.username + "/" + target.username + "/" + endpoint);

        if (response.status === 200) {
            setFollow(!follow);
            const newFollowerCount = follow ? target.follower_counter - 1 : target.follower_counter + 1;
            setTarget({
                ...target,
                follower_counter: newFollowerCount
            });
            alert(`You have ${follow ? 'unfollowed' : 'followed'} this user.`);
        } else {
            alert("There seems to be some error. Please try again.");
        }
    };

    const handleBlockClick = async () => {
        const endpoint = block ? 'unblock' : 'block';
        const response = await request.put("interaction/" + self.username + "/" + target.username + "/" + endpoint);

        if (response.status === 200) {
            setBlock(!block);
            alert(`You have ${block ? 'unblocked' : 'blocked'} this user.`);
        } else {
            alert("There seems to be some error. Please try again.");
        }
    };

    const handleReportClick = async () => {
        if (!report) {
            const response = await request.put("interaction/" + self.username + "/" + target.username + "/report");

            if (response.status === 200) {
                setReport(true);
                alert("You have reported this user.");
                window.location.reload(true);
            } else {
                alert("There seems to be some error. Please try again.");
            }
        } else {
            alert("You have reported this user.");
        }
    };

    const handleEditClick = () => {
        setEditgender(target.gender);
        console.log(target.gender)
        setTextAreaValue(target.about);
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();
        const portrait = document.getElementById("portrait").files[0];
        let formData = new FormData();
        if (portrait !== undefined) {
            formData.append('portrait', portrait);
        }
        else {
            formData.append('portrait', "");
        }
        formData.append('gender', editgender);
        console.log(editgender);
        formData.append('about', textAreaValue);

        try {
            const response = await request.put("profile/" + self.username, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.status === 200) {
                alert("Update Profile Successfully!");
                window.location.reload(true);
            } else if (response.status === 413) {
                alert("Please upload a portrait with size less than 10 Mb.");
            } else {
                alert("There seems to be some error. Please try again.");
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleAboutChange = (event) => {
        setTextAreaValue(event.target.value);
    }
    const handleGenderChange = (event) => {
        setEditgender(event.target.value);
    };
    const handleChatClick = async () => {
        try {
            await request.post("server/conversations", JSON.stringify({
                senderId: self.uid,
                receiverId: target.uid
            })).then(res => {
                if (res.status === 200) {
                    navigate(`/messenger`);
                }
                else {
                    alert("There seems to be some error. Please try again.");
                }
            });
        } catch (err) {
            console.log(err);
        }
    }


    return (<>
        {(mode === 'admin' || (!block && !beblocked)) && <Container fluid>
            <div id="scrollableDiv" className='border' style={{ height: "80vh", overflowX: "hidden", overflowY: "scroll" }}>
                {target['username'] !== self['username'] && <Row>
                    <BackButton />
                </Row>}

                <div class='row'>
                    <div class='col-sm-3'>
                        <img src={BACK_END + target.portrait} width={180} height={180} alt='avatar' class='profile-portrait' style={{ objectFit: 'cover' }}></img>
                    </div>
                    <div class='col-sm-7'>
                        <div class='row' id='name-id'>
                            <div className='ms-2 text-black' id='profile-username'>{target['username']}</div>
                            <div className='ms-2 text-muted'> @{target['uid']} </div>
                        </div>
                        <div class='row'>
                            <span className='ms-2 text-black'> {target['about']} </span>
                        </div>
                        <div class='row'>
                            <span className='ms-2 text-muted'> {target['gender']} </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', marginBottom: '10px' }}>
                            <Link
                                to={"/" + target['username'] + "/followers"}
                                id='followers'
                                className='ms-2 text-muted'
                                style={{
                                    // textDecoration: 'none',
                                    color: 'inherit',
                                    marginRight: '10px'
                                }}
                            >
                                Followers: {target['follower_counter']}
                            </Link>
                            <Link
                                to={"/" + target['username'] + "/followings"}
                                id='followings'
                                className='ms-2 text-muted'
                                style={{
                                    // textDecoration: 'none',
                                    color: 'inherit',
                                }}
                            >
                                Following: {target['following_counter']}
                            </Link>
                        </div>
                    </div>
                    <div class='col'>
                        <div className="btn-group-vertical" >
                            {
                                mode === 'user' && target['username'] === self['username'] &&
                                <button type="button" onClick={handleEditClick} className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#editProfileForm" data-bs-whatever="@mdo" style={{ width: '130px', fontSize: '18px', margin: '10px', bottom: '-20px', borderRadius: '30px' }}>
                                    Edit Profile
                                </button>
                            }
                            {
                                mode === 'user' && target['username'] !== self['username'] && (
                                    <button type="button" onClick={handleFollowClick} className={`btn ${block ? 'btn-light' : 'btn-secondary'}`} id="follow" style={{ borderColor: ' #6c757d', width: '130px', fontSize: '18px', margin: '10px', borderRadius: '30px' }}>
                                        {follow ? 'Unfollow' : 'Follow'}
                                    </button>)
                            }
                            {
                                mode === 'user' && target['username'] !== self['username'] && (
                                    <button type="button" onClick={handleBlockClick} className={`btn ${block ? 'btn-light' : 'btn-secondary'}`} id="block" style={{ borderColor: ' #6c757d', width: '130px', fontSize: '18px', margin: '10px', borderRadius: '30px' }}>
                                        {block ? 'Unblock' : 'Block'}
                                    </button>)
                            }
                            {
                                mode === 'user' && target['username'] !== self['username'] && (
                                    <button type="button" onClick={handleReportClick} className={`btn ${report ? 'btn-light' : 'btn-secondary'}`} id="block" style={{ width: '130px', fontSize: '18px', margin: '10px', borderRadius: '30px' }} disabled={report}>
                                        {report ? 'Reported' : 'Report'}
                                    </button>)
                            }
                            {
                                mode === 'user' && target['username'] !== self['username'] &&
                                <button type="button" onClick={handleChatClick} className="btn btn-secondary" data-bs-whatever="@mdo" style={{ width: '130px', fontSize: '18px', margin: '10px', borderRadius: '30px' }}>
                                    Chat
                                </button>
                            }
                        </div>
                    </div>
                </div>
                <div className="modal fade" id="editProfileForm" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel"> Edit Profile </h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="gender" className="col-form-label"> Gender: </label>
                                        <Form.Select
                                            aria-label="Default select example"
                                            value={editgender}
                                            onChange={handleGenderChange}
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Others">Others</option>
                                            <option value="">Not to Specify</option>
                                        </Form.Select>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="text" className="col-sm-12 col-form-label"> Portrait (no larger than 10 Mb): </label>
                                        <input type="file" className="form-control" id="portrait" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="about-text" className="col-form-label"> About: </label>
                                        <textarea onChange={handleAboutChange} className="form-control" id="about" rows="4" defaultValue={textAreaValue} />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"> Cancel </button>
                                <button type="button" className="btn btn-secondary" onClick={handleEditSubmit} data-bs-dismiss="modal"> Submit </button>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    (target['username'] === self['username'] &&
                        <Row>
                            <Col>
                                <div className="btn-group d-flex mb-3" role="group" aria-label="...">
                                    <button
                                        type="button"
                                        className={`btn btn-underline-only w-100 ${viewMode === 'MyPosts' ? 'active' : ''}`}
                                        onClick={() => setViewMode("MyPosts")}
                                    >
                                        My Posts
                                    </button>
                                    <button
                                        type="button"
                                        className={`btn btn-underline-only w-100 ${viewMode === 'Likes' ? 'active' : ''}`}
                                        onClick={() => setViewMode("Likes")}
                                    >
                                        Likes
                                    </button>
                                </div>

                                <div className="row">
                                    {viewMode === "MyPosts" && <MyPostsList username={target.username} />}
                                    {viewMode === "Likes" && <LikesList />}
                                </div>
                            </Col>
                        </Row>) ||
                    <Row>
                        <Col>
                            <div className="btn-group d-flex mb-3" role="group" aria-label="...">
                                    <button
                                        type="button"
                                        className={`btn btn-underline-only w-100 'active'`}
                                    >
                                        Posts
                                    </button>
                            </div>
                            <div className="row">
                                {viewMode === "MyPosts" && <MyPostsList username={target.username} />}
                            </div>

                            <div className="modal fade" id="report-user" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5" id="staticBackdropLabel"><FontAwesomeIcon icon={faWarning}></FontAwesomeIcon>Warning</h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            Are you sure to report this user?
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                            <button type="button" className="btn btn-secondary" onClick={handleReportClick} data-bs-dismiss="modal">Confirm</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                }
            </div>
        </Container>}
        {block && <Container fluid>
            <Row>
                <BackButton />
            </Row>
            <div className="row">
                <div className="col-md-3"></div>
                <div className="col-md-6">
                    <div className="alert alert-danger" role="alert">
                        You have blocked this user.
                    </div>
                    <button type="button" onClick={handleBlockClick} className={`btn ${block ? 'btn-light' : 'btn-secondary'}`} id="block" style={{ borderColor: ' #6c757d', width: '130px', fontSize: '18px', margin: '10px', borderRadius: '30px' }}>
                        {block ? 'Unblock' : 'Block'}
                    </button>
                </div>
                <div className="col-md-3"></div>
            </div>
        </Container>}
        {beblocked && <Container fluid>
            <Row>
                <BackButton />
            </Row>
            <div className="row">
                <div className="col-md-3"></div>
                <div className="col-md-6">
                    <div className="alert alert-danger" role="alert">
                        This user has blocked you.
                    </div>
                </div>
                <div className="col-md-3"></div>
            </div>
        </Container>}
    </>
    );
}



function MyPostsList({ username }) {
    const { username: self, mode } = useAuth();
    const [tweets, setTweets] = useState([]);
    const [target, setTarget] = useState(username);

    const fetchInfo = async () => {
        let tweetrec;

        if (mode === 'user') {
            tweetrec = await request.get("profile/" + self + "/" + target + "/tweets", {
                headers: {
                    'Accept': 'application/json'
                }
            });
        } else {
            tweetrec = await request.get("profile/" + target + "/tweets", {
                headers: {
                    'Accept': 'application/json'
                }
            });
        }

        let fetchedTweets = tweetrec.data;
        console.log(tweetrec);
        console.log(fetchedTweets);
        fetchedTweets.sort(compare);

        setTweets(fetchedTweets);
    }

    useEffect(() => {
        fetchInfo();
    }, [target]);


    const compare = (tweetA, tweetB) => {
        if (tweetA.time > tweetB.time) {
            return -1;
        }
        if (tweetA.time < tweetB.time) {
            return 1;
        }
        return 0;
    }


    return (
        <InfiniteScroll dataLength={tweets.length} next={null} hasMore={false} scrollableTarget="scrollableDiv"
            endMessage={<p style={{ textAlign: 'center' }}>
                <b>No More Posts</b>
            </p>}>
            <TweetListView tweetInfos={tweets} />
        </InfiniteScroll>
    );
}



function LikesList() {
    const [likes, setLikes] = useState([]);
    const { username, mode } = useAuth();

    const fetchInfo = async () => {
        let tweetrec = await request.get("profile/" + username + "/likes", {
            headers: {
                'Accept': 'application/json'
            }
        });
        let likes = tweetrec.data;

        likes.sort(compare);

        setLikes(likes);
    }

    const compare = (tweetA, tweetB) => {
        if (tweetA.time > tweetB.time) {
            return -1;
        }
        if (tweetA.time < tweetB.time) {
            return 1;
        }
        return 0;
    }

    useEffect(() => {
        fetchInfo();
    }, []);

    return (
        <InfiniteScroll dataLength={likes.length} next={null} hasMore={false} scrollableTarget="scrollableDiv"
            endMessage={<p style={{ textAlign: 'center' }}>
                <b>No More Posts</b>
            </p>}>
            <TweetListView tweetInfos={likes} />
        </InfiniteScroll>
    );
}

export default Profile;
