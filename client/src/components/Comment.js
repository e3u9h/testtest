import * as React from 'react';
import { Link } from "react-router-dom";
import { faStairs } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BACK_END } from '../config';
import { timeDisplay } from '../utils/Utils';

class Comment extends React.Component {
    constructor(props) {
        super(props);
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
                    <CommentForm floor={this.props.floor} tid={this.props.tid} addReply={this.props.addReply} />
                    <div data-bs-toggle="modal" data-bs-target={"#commentForm" + this.props.floor} data-bs-whatever="@mdo" data-target="#GSCCModal" onClick={() => console.log(this.props.floor)}>
                        <FontAwesomeIcon icon={faComment} className="text-secondary" />
                    </div>
                </div>

            </div>
        )
    }
}

{/** this is used to comment comment */ }
class CommentForm extends React.Component {
    constructor(props) {
        super(props);
        console.log("Here is this.props.floor",this.props.floor)
    }

    render() {
        return (
            <div class="modal fade" id={"commentForm" + this.props.floor} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5"> Re floor {this.props.floor}</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <textarea className="form-control" id={'new-comment' + this.props.floor} rows='5'></textarea>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal"> Cancel </button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onClick={() => this.props.addReply(this.props.floor)}> Send </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default Comment;