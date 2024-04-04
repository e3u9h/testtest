import React from 'react';
import UserListView from './User';
import InfiniteScroll from 'react-infinite-scroll-component';
import {BACK_END} from './App';
import { getLoginInfo } from './Login';

class SearchUserid extends React.Component{
        
    constructor(props){
        super(props);
        this.state = {
            username: window.location.pathname.split('/')[2],
            selfname : getLoginInfo()['username'],
            userList:[]
        };


    }
    
    async getAllUser() {
        let res = await fetch(BACK_END + "searchuserbyid/" + this.state.selfname + "/" + this.state.username, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        let l = await res.json();
        this.state.userList = await l;
        this.setState((prevState) => ({ userList: l }));
        console.log(this.state.userList);
    }
    
    componentWillMount(){
        this.getAllUser();
    }
  
    
    render() {
        const { userList } = this.state;
      
        return (
          <div id='scrollabletweets' style={{ height: "95vh", overflow: "auto" }}>
            <InfiniteScroll
              dataLength={userList.length}
              next={null} // Since you have hasMore set to false, next is not needed. You can remove it if you are not planning to implement it in the future.
              hasMore={false} // If you're never loading more, this might not be needed.
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
        );
      }   
    
}

export default SearchUserid;
    