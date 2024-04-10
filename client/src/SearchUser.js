import React, { useEffect } from 'react';
import UserListView from './User';
import InfiniteScroll from 'react-infinite-scroll-component';
import { BACK_END } from './App';
import { getLoginInfo } from './Login';
import BackButton from './components/backbutton';

class SearchUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
    };
  }

  componentDidMount() {
    this.getAllUser();
  }

  async getAllUser() {
    const username = window.location.pathname.split('/')[2];
    const selfname = getLoginInfo()['username'];

    try {
      const res = await fetch(
        BACK_END + 'searchuser/' + selfname + '/' + username,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
      const userList = await res.json();
      this.setState({ userList });
      console.log(this.state.userList);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  render() {
    return (
      <>
        <div className='row'>
          <BackButton />
        </div>
        <div id='scrollabletweets' style={{ height: '95vh', overflow: 'auto' }}>
          <InfiniteScroll
            dataLength={this.state.userList.length}
            next={null}
            hasMore={false}
            scrollableTarget='scrollabletweets'
            endMessage={<p style={{ textAlign: 'center' }}><b>No more Users</b></p>}
          >
            <UserListView userInfos={this.state.userList} />
          </InfiniteScroll>
        </div>
      </>
    );
  }
}

export default SearchUser;