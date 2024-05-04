import React, { useState, useEffect } from 'react';
import UserListView from './components/User';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAuth } from './provider/context';
import BackButton from './components/backbutton';
import request from './utils/request';

const SearchUserid = () => {
  const { username: currentUser } = useAuth();
  const searchUserId = window.location.pathname.split('/')[2];
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await request.get(`searchuserbyid/${currentUser}/${searchUserId}`, {
          headers: {
            'Accept': 'application/json'
          }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, [currentUser, searchUserId]);

  return (
    <>
      <div className="row">
        <BackButton />
      </div>
      <div id="userScrollContainer" style={{ height: '80vh', overflowY: 'scroll' }}>
        <InfiniteScroll
          dataLength={users.length}
          next={null}
          hasMore={false}
          scrollableTarget="userScrollContainer"
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>No more Users</b>
            </p>
          }
        >
          <UserListView userInfos={users} />
        </InfiniteScroll>
      </div>
    </>
  );
};

export default SearchUserid;