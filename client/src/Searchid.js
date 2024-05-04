import React, { useState, useEffect } from 'react';
import UserListView from './components/User';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAuth } from './provider/context';
import BackButton from './components/backbutton';
import request from './utils/request';

const SearchUserid = () => {
  const { username: selfname } = useAuth();
  const username = window.location.pathname.split('/')[2];
  const [userList, setUserList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const getAllUser = async () => {
    try {
      const res = await request.get(`searchuserbyid/${selfname}/${username}`, {
        headers: {
          'Accept': 'application/json'
        },
        params: {
          page: page
        }
      });
      
      const newData = res.data;
      setUserList(prevUserList => [...prevUserList, ...newData]);
      setHasMore(newData.length > 0);
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    getAllUser();
  }, [selfname, username]);

  return (
    <>
      <div className='row'>
        <BackButton />
      </div>
      <div id='scrollabletweets' style={{ height: "80vh", overflowY: "scroll" }}>
        <InfiniteScroll
          dataLength={userList.length}
          next={getAllUser}
          hasMore={hasMore}
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
};

export default SearchUserid;