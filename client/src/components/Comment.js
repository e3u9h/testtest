import * as React from 'react';
import { Link } from "react-router-dom";
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BACK_END } from '../config';
import { timeDisplay } from '../utils/Utils';
import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

// Declaration: we use poe.com to generate some code and fix some bugs in this file

// Reference of this component: https://github.com/lucashaozh/Chirpin/blob/main/chirpin/client/src/Comment.js
class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showCommentModal: false,
        };
    }
    render() {
        return (
            <div class="list-group-item d-flex">
                <Link to={'/' + this.props.name}>
                    <img className="img d-inline-block m-2 rounded-circle" style={{ width: "50px", height: "50px" }} src={BACK_END + this.props.portrait} alt="Card image cap" />
                </Link>
                <div className="d-flex w-100 px-2 justify-content-between">
                    <div>
                        {/* user name and floor */}
                        <div className="row">
                            <div className="col-auto">
                                <h6 className="mb-0 py-1">{this.props.name}</h6>
                            </div>
                            <div className="col-auto">
                                <h6 className="mb-0 py-1 text-secondary">{"Floor " + this.props.floor}</h6>
                            </div>
                        </div>
                        {/* recomment content */}
                        <p className="mb-0 py-1 opacity-75">{this.props.content}</p>
                    </div>
                </div>

                {/* show time and recomment button */}
                <div className="d-flex flex-column flex-column align-items-end">
                    <small className="opacity-50 text-nowrap">{timeDisplay(this.props.time)}</small>
                    <CommentForm floor={this.props.floor} tid={this.props.tid} addReply={this.props.addReply} showCommentModal={this.state.showCommentModal} />
                    <div onClick={() => { console.log(this.props.floor); this.setState({ showCommentModal: !this.state.showCommentModal }); }}>
                        <FontAwesomeIcon icon={faComment} className="text-secondary" />
                    </div>
                </div>

            </div>
        )
    }
}

{/** this is used to comment comment */ }
function CommentForm({ floor, addReply, showCommentModal }) {
    const [comment, setComment] = useState('');
    const [show, setShow] = useState(showCommentModal);
    useEffect(() => {
        setShow(showCommentModal);
    }, [showCommentModal]);
  
    const handleCommentChange = (e) => {
      setComment(e.target.value);
    };
  
    const handleSendClick = () => {
      addReply(floor, comment);
      setComment('');
        setShow(false);
    };
    const handleCommentModalClose = () => {
        setShow(false);
    };
  
    return (
        <Modal show={show} onHide={handleCommentModalClose}>
            <Modal.Header closeButton>
                <Modal.Title>Re floor {floor}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <textarea className="form-control" value={comment} onChange={handleCommentChange} rows='5'></textarea>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCommentModalClose}>
                    Cancel
                </Button>
                <Button variant="secondary" onClick={handleSendClick}>
                    Send
                </Button>
            </Modal.Footer>
        </Modal>
    );
}


export default Comment;