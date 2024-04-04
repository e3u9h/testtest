import { Container } from '@material-ui/core';
import * as React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useState } from 'react';
import {BACK_END} from './App';
import { Link } from 'react-router-dom';

class Admin extends React.Component {

    render() {
        return (<>
            <Container fluid>
                <div id="scrollableDiv" className='border' style={{ height: "100vh", overflow: "auto" }}>
                    <ListUser/>
                    <DeleteUser />
                </div>
            </Container>
        </>
        );
    }

}

class ListUser extends React.Component {
  constructor(props) {
      super(props);
      this.state = { userList: []};
    }
  
  async getAllUser(){
      let res = await fetch(BACK_END + 'reportusers',{
        method:'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      let l = await res.json();
      await this.setState({userList:l});
      console.log(this.state.userList);
    }
    componentDidMount(){
      this.getAllUser()
    }

  render() {
      return (<>
          <InfiniteScroll dataLength={this.state.userList.length} next={null} hasMore={false} scrollableTarget="scrollableDiv"
              endMessage={<p style={{ textAlign: 'center' }}>
                  <h6>That's all users :)</h6>
                  <UserListView userInfos={this.state.userList}/>
              </p>}>
          </InfiniteScroll>
      </>
      );
  }
}

const UserView = (props) => {
  return (
    <form className="row g-3 border-bottom" style={{ padding: '20px' }}>
      <div className="col-auto" style={{ width: '50%', textAlign: 'center' }}>
        <label htmlFor="interest" className="col-form-label" style={{ fontWeight: 'bold' }}>
          {props.name}
        </label>
      </div>
      <div className="col-auto" style={{ width: '25%' }}></div>
      <div className="col-auto" style={{ width: '25%', textAlign: 'center' }}>
        <Link to={`/${props.name}`}>
          <button type="button" className="btn btn-secondary">
            View Details
          </button>
        </Link>
      </div>
    </form>
  );
};

function UserListView({ userInfos }) {

  const [userInfoList, setUserList] = useState(userInfos);

  return (
      <>
          <div className="container-fluid border" style={{padding: '20px'}}>
              <div class="row mb-3">
                  <h3 id="updateTtitle"> List User </h3>
              </div>
              <div className='row g-3 border-bottom' style={{padding: '20px'}}>
                  <div class="col-auto" style={{width: '50%', textAlign: 'center'}}>
                      <h5> Username </h5>
                  </div>
                      <div class="col-auto" style={{width: '25%'}}>
                  </div>
                  <div class="col-auto" style={{width: '25%', textAlign: 'center'}}>
                      <h5> Operation </h5>
                  </div>
                  
              </div>
              {userInfos.map((userInfo, index) =>
                  <UserView name={userInfo.username} id={userInfo.id} key={index} />
              )}
          </div >
      </>
  );

}

export { Admin };
