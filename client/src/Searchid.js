import React, { useState, useEffect } from 'react';
import UserListView from './components/User';
import InfiniteScroll from 'react-infinite-scroll-component';
import {BACK_END} from './App';
import { useAuth } from './provider/context';
import BackButton from './components/backbutton';

const SearchUserid = () => {
  const { username: selfname } = useAuth();
  const username = window.location.pathname.split('/')[2];
  const [userList, setUserList] = useState([]);

  const getAllUser = async () => {
    let res = await fetch(BACK_END + "searchuserbyid/" + selfname + "/" + username, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        let l = await res.json();
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
    