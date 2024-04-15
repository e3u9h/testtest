import React, { useState, useEffect } from 'react';
import UserListView from './components/User';
import InfiniteScroll from 'react-infinite-scroll-component';
import { BACK_END } from './App';
import { useAuth } from './provider/context';
import BackButton from './components/backbutton';

const SearchUser = () => {
  const { username: selfname } = useAuth();
  console.log(selfname);
    const username = window.location.pathname.split('/')[2];
  const [userList, setUserList] = useState([]);

  const getAllUser = async () => {
    try {
        const res = await fetch(BACK_END + 'searchuser/' + selfname + '/' + username, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });
        const userList = await res.json();
      setUserList(userList);
      console.log(userList);
    } catch (error) {
      console.error('Error:', error);
    }
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

export default SearchUser;