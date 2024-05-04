import React, { useEffect, useState } from 'react';
import UserListView from './components/User';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAuth } from './provider/context';
import BackButton from './components/backbutton';
import request from './utils/request';

const SearchUser = () => {
  const { username: selfname } = useAuth();
  const username = window.location.pathname.split('/')[2];
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    getAllUser();
  }, []);

  const getAllUser = async () => {
    try {
      const res = await request.get(`searchuser/${selfname}/${username}`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      const newUserList = res.data;
      setUserList(newUserList);
      console.log(newUserList);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <div className='row'>
        <BackButton />
      </div>
      <div id='scrollabletweets' style={{ height: '95vh', overflow: 'auto' }}>
        <InfiniteScroll
          dataLength={userList.length}
          next={() => {}}
          hasMore={false}
          scrollableTarget='scrollabletweets'
          endMessage={<p style={{ textAlign: 'center' }}><b>No more Users</b></p>}
        >
          <UserListView userInfos={userList} />
        </InfiniteScroll>
      </div>
    </>
  );
};

export default SearchUser;