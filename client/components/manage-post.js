import React from 'react'

import PropTypes from 'prop-types'

import './manage-post.css'

const ManagePost = (props) => {
  return (
    <div className={`manage-post-container ${props.rootClassName} `}>
      <div className="manage-post-container1">
        <div className="manage-post-container2">
          <div className="manage-post-container3">
            <div className="manage-post-container4"></div>
          </div>
          <button type="button" className="manage-post-button button">
            {props.followStatusbutton2}
          </button>
        </div>
        <span className="manage-post-text">{props.notChange}</span>
        <span className="manage-post-text1">{props.blockDate}</span>
        <span className="manage-post-text2">{props.postID1}</span>
        <button type="button" className="manage-post-button1 button">
          {props.followStatusbutton21}
        </button>
      </div>
    </div>
  )
}

ManagePost.defaultProps = {
  delete: 'Delete',
  followStatusbutton21: 'Blocked',
  notChange: 'Post Date:',
  followStatusbutton2: 'Delete',
  rootClassName: '',
  postID: 'Input ID here',
  blockDate: 'Datehere',
  followStatusbutton1: 'Blocked',
  postID1: 'Input post ID',
}

ManagePost.propTypes = {
  delete: PropTypes.string,
  followStatusbutton21: PropTypes.string,
  notChange: PropTypes.string,
  followStatusbutton2: PropTypes.string,
  rootClassName: PropTypes.string,
  postID: PropTypes.string,
  blockDate: PropTypes.string,
  followStatusbutton1: PropTypes.string,
  postID1: PropTypes.string,
}

export default ManagePost
