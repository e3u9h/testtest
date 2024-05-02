import React, { useState, useEffect } from 'react';
import UserListView from './components/User';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAuth } from './provider/context';
import BackButton from './components/backbutton';
import request from './utils/request';
//get the target user by id
const SearchUserid = () => {
  const { username: selfname } = useAuth();
  const username = window.location.pathname.split('/')[2];
  const [userList, setUserList] = useState([]);
  const getAllUser = async () => {
    const res = await request.get("searchuserbyid/" + selfname + "/" + username, {
      headers: {
        'Accept': 'application/json'
      }
    });
    const l = res.data;
      setUserList(l);
      console.log(l);
    }

  useEffect(() => {
    getAllUser();
  }, []);

  return (
    <>
      <div className='row'>
        <BackButton />
      </div>
      <div id='scrollabletweets' style={{ height: "95vh", overflow: "auto" }}>
        <InfiniteScroll
          dataLength={userList.length}
            next={null}
            hasMore={false}
            scrollableTarget="scrollabletweets"
            endMessage={
              <p style={{ textAlign: 'center' }}>
                <b>No more Users</b>
              </p>
            }
          >
            <UserListView userInfos={userList} />
          </InfiniteScroll>
        </div>
        </>
    );
}

export default SearchUserid;
    