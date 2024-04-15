import { Link } from 'react-router-dom';
import { useState } from 'react';
import { getLoginInfo } from '../Login';
import { BACK_END } from '../App';

function UserCard({ userInfo }) {
  const [isFollowing, setIsFollowing] = useState(userInfo["isFollowing"]);
  const [followingCount, setFollowingCount] = useState(userInfo["following"]);
  const [followerCount, setFollowerCount] = useState(userInfo["follower"]);

  const username = userInfo["username"];
  const portraitUrl = userInfo["portraitUrl"];

  const handleFollowClick = async () => {
    const endpoint = isFollowing ? 'unfollow' : 'follow';
    const response = await fetch(`${BACK_END}interaction/${getLoginInfo()['username']}/${username}/${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.status === 200) {
      const newFollowerCount = isFollowing ? followerCount - 1 : followerCount + 1;
      setIsFollowing(!isFollowing);
      setFollowerCount(newFollowerCount);
      alert(`You have ${isFollowing ? 'unfollowed' : 'followed'} this user.`);
    } else if (response.status === 403) {
      response.text().then(text => alert(text));
    } else {
      alert("There seems to be some error. Please try again.");
    }
  };

  return (
    <div className="p-2 col-4">
      <div className="card" style={{ borderRadius: "15px" }}>
        <div className="card-body p-4 row">
          <div className="d-flex text-black">
            <div className="col-4 flex-shrink-0">
              <Link to={"/" + username}>
                <img src={BACK_END + portraitUrl}
                  alt="Generic placeholder image" className="img-fluid"
                  style={{ width: "150px", borderRadius: "10px" }} />
              </Link>
            </div>
            <div className="col-8 ms-3">
              <h5 className="m-1">{username}</h5>
              <div className="row d-flex justify-content-center rounded-3 py-1 m-1 my-2"
                style={{ backgroundColor: "#efefef" }}>
                <div className="col-md-6">
                  <p className="small text-muted mb-1 overflow-hidden d-flex flex-nowrap">Followings</p>
                  <p className="mb-0 d-flex flex-nowrap">{followingCount}</p>
                </div>
                <div className="col-md-6">
                  <p className="small text-muted mb-1 overflow-hidden d-flex flex-nowrap">Followers</p>
                  <p className="mb-0 d-flex flex-nowrap">{followerCount}</p>
                </div>
              </div>
              {getLoginInfo()['mode'] === 'user' && <div className="d-flex m-2 justify-content-center">
                <button type="button" className={"btn btn-" + (isFollowing ? "outline-" : "") + "secondary flex-grow-1"} onClick={handleFollowClick}>{isFollowing ? "Unfollow" : "Follow"}</button>
              </div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function UserListView({ userInfos }) {
  return (
    <>
      {
        <div className='container-fluid' >
          <div className="row m-1 ">
            {userInfos.map((userInfo, col) => {
              return (
                userInfo && <UserCard userInfo={userInfo} key={col} />
              )
            })}
          </div>
        </div>
      }
    </>
  )
}

export default UserListView;