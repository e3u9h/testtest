import * as React from 'react';
import Container from 'react-bootstrap/Container';
import { useParams } from 'react-router-dom';
import "./css/profile.css"

class Profile extends React.Component {

    constructor(props) {
        super(props);
    }

    async fetchInfo() {

    }

    render() {
        return (<>
            <Container fluid>
            </Container></>
        );
    }

}

function ProfileWrapper(props) {
    const { username } = useParams();
    return <Profile {...props} username={username} />;
}

export default ProfileWrapper;
