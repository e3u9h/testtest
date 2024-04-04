import * as React from 'react';


class Comment extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div class="list-group-item d-flex">    
            </div>
        )
    }
}

{/** this is used to comment comment */}
class CommentForm extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div class="modal fade" id={"commentForm"+this.props.floor} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            </div>  
        )
    }
}


export default Comment;