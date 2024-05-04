import React, { useState, useEffect } from 'react';
import UserListView from './components/User';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAuth } from './provider/context';
import BackButton from './components/backbutton';
import request from './utils/request';
import { useParams } from 'react-router-dom';

const SearchUser = () => {
  const { username: currentUser } = useAuth();
  const { username: searchUsername } = useParams();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const searchUsers = async () => {
      try {
        const response = await request.get(`searchuser/${currentUser}/${searchUsername}`, {
          headers: {
            Accept: 'application/json',
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to search users:', error);
      }
    };

    searchUsers();
  }, [currentUser, searchUsername]);

  return (
    <div>
      <BackButton />
      <div id="userScrollContainer" style={{ height: '95vh', overflow: 'auto' }}>
        {users.length > 0 ? (
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
        ) : (
          <p style={{ textAlign: 'center' }}>No users found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchUser;