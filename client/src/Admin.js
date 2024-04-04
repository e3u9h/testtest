import { Container } from '@material-ui/core';
import * as React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useState } from 'react';
import {BACK_END} from './App';

class Admin extends React.Component {

    render() {
        return (<>
            <Container fluid>
                <div id="scrollableDiv" className='border' style={{ height: "100vh", overflow: "auto" }}>
                    <ListUser/>
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
              </p>}>
          </InfiniteScroll>
      </>
      );
  }
}



export { Admin };
