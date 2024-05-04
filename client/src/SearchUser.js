import React, { useState, useEffect } from 'react';
import UserListView from './components/User';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAuth } from './provider/context';
import BackButton from './components/backbutton';
import request from './utils/request';
import { useParams } from 'react-router-dom';

const SearchUser = () => {
  const { username: selfname } = useAuth();
  const { username } = useParams();
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await request.get(`searchuser/${selfname}/${username}`, {
          headers: {
            'Accept': 'application/json'
          }
        });
        setUserList(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [selfname, username]);

  return (
    <div>
      <BackButton />
      <div id='scrollabletweets' style={{ height: "95vh", overflow: "auto" }}>
        {userList.length > 0 ? (
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
        ) : (
          <p style={{ textAlign: 'center' }}>No users found.</p>
        )}
      </div>
    </div>
  );
}

export default SearchUser;