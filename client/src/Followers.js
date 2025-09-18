import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import UserListView from './components/User';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAuth } from './provider/context';
import BackButton from './components/backbutton';
import request from './utils/request';
import { useParams } from 'react-router-dom';


// page for the followers of a user
function Followers() {
    const props = useParams();
    const [followers, setFollowers] = useState([]);
    const { username: self, mode } = useAuth();

    async function fetchInfo() {
        // fetch followers information
        const target = props.username;
        console.log(self);
        console.log(target);
        let followersrec = await request.get("followinfo/" + self + "/" + target + "/followers", {
            headers: {
                'Accept': 'application/json'
            }
        });
        console.log(followersrec);
        const followersData = followersrec.data;
        setFollowers(followersData);
    }

    useEffect(() => {
        fetchInfo();
    }, []);

    return (
        <>
            <Container fluid>
                <div id="scrollableDiv" className='border' style={{ height: "100vh", overflowX: "hidden", overflowY: "scroll" }}>
                    <div className='row'>
                        <BackButton />
                    </div>
                    <InfiniteScroll
                        dataLength={followers.length}
                        next={null}
                        hasMore={false}
                        scrollableTarget="scrollableDiv"
                        endMessage={
                            <p style={{ textAlign: 'center' }}>
                                <b>That's all</b>
                            </p>
                        }
                    >
                        <UserListView userInfos={followers} />
                    </InfiniteScroll>
                </div>
            </Container>
        </>
    );
}

export { Followers };
