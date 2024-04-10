import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import UserListView from './User';
import InfiniteScroll from 'react-infinite-scroll-component';
import { BACK_END } from './App';
import { getLoginInfo } from './Login';
import BackButton from './components/backbutton';

function Followers() {
    const [followers, setFollowers] = useState([]);

    async function fetchInfo() {
        // fetch followers information
        let self = getLoginInfo()['username'];
        let target = window.location.pathname.split('/')[1];
        let mode = getLoginInfo()['mode'];
        let followersrec;
        if (mode === 'user') {
            followersrec = await fetch(BACK_END + "profile/" + self + "/" + target + "/followers", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
        } else {
            followersrec = await fetch(BACK_END + "profile/" + target + "/followers", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
        }
        const followersData = await followersrec.json();
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
