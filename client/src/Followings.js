import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import UserListView from './components/User';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAuth } from './provider/context';
import BackButton from './components/backbutton';
import request from './utils/request';

function Followings() {
    const [followings, setFollowings] = useState([]);
    const { username: self, mode } = useAuth();

    async function fetchInfo() {
        let target = window.location.pathname.split('/')[1];
        let followingsrec = await request.get("followinfo/" + self + "/" + target + "/followings", {
            headers: {
                'Accept': 'application/json'
            }
        });
        const followingsData = followingsrec.data;
        setFollowings(followingsData);
    }

    useEffect(() => {
        fetchInfo();
    }, []);

    return (
        <>
            <Container fluid>
                <div id="scrollableDiv" className='border' style={{ height: "80vh", overflowX: "hidden", overflowY: "scroll" }}>
                    <div className='row'>
                        <BackButton />
                    </div>
                    <InfiniteScroll
                        dataLength={followings.length}
                        next={null}
                        hasMore={false}
                        scrollableTarget="scrollableDiv"
                        endMessage={
                            <p style={{ textAlign: 'center' }}>
                                <b>That's all</b>
                            </p>
                        }
                    >
                        <UserListView userInfos={followings} />
                    </InfiniteScroll>
                </div>
            </Container>
        </>
    );
}

export { Followings };
