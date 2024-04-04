import * as React from 'react';
import Container from 'react-bootstrap/Container';
import UserListView from './User';
import InfiniteScroll from 'react-infinite-scroll-component';
import {BACK_END} from './App';
import { getLoginInfo } from './Login';

class Followings extends React.Component {

    constructor(props){
        super(props);
        this.state = { 
            followings: []
        };
    }

    async fetchInfo() {
    }
    
    componentWillMount(){
        this.fetchInfo();
    }

    render() {
        return (<>
            <Container fluid>
            </Container></>
        );
    }

}

export { Followings };
