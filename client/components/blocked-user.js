import React from 'react'

import PropTypes from 'prop-types'

import './blocked-user.css'

const BlockedUser = (props) => {
  return (
    <div className={`blocked-user-container ${props.rootClassName} `}>
      <div className="blocked-user-container1">
        <div className="blocked-user-container2">
          <img
            alt={props.imageAlt}
            src={props.imageSrc}
            className="blocked-user-image"
          />
        </div>
        <div className="blocked-user-container3">
          <span className="blocked-user-text">{props.name}</span>
          <button type="button" className="blocked-user-button button">
            {props.followStatusbutton}
          </button>
          <div className="blocked-user-container4">
            <span className="blocked-user-text1">{props.iD}</span>
          </div>
        </div>
        <span className="blocked-user-text2">{props.notChange}</span>
        <span className="blocked-user-text3">{props.blockDate}</span>
      </div>
    </div>
  )
}

BlockedUser.defaultProps = {
  rootClassName: '',
  blockDate: 'Datehere',
  imageAlt: 'image',
  name: 'Username',
  followStatusbutton: 'Blocked',
  imageSrc: 'https://play.teleporthq.io/static/svg/default-img.svg',
  iD: 'UserID',
  notChange: 'Block Date:',
}

BlockedUser.propTypes = {
  rootClassName: PropTypes.string,
  blockDate: PropTypes.string,
  imageAlt: PropTypes.string,
  name: PropTypes.string,
  followStatusbutton: PropTypes.string,
  imageSrc: PropTypes.string,
  iD: PropTypes.string,
  notChange: PropTypes.string,
}

export default BlockedUser
