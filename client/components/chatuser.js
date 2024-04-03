import React from 'react'

import PropTypes from 'prop-types'

import './chatuser.css'

const Chatuser = (props) => {
  return (
    <div className={`chatuser-container ${props.rootClassName} `}>
      <div className="chatuser-container1 button">
        <div className="chatuser-container2">
          <img
            alt={props.imageAlt1}
            src={props.imageSrc1}
            className="chatuser-image"
          />
        </div>
        <div className="chatuser-container3">
          <span className="chatuser-text">{props.iD}</span>
          <span className="chatuser-text1">{props.name}</span>
        </div>
      </div>
    </div>
  )
}

Chatuser.defaultProps = {
  name: 'Username',
  imageAlt1: 'image',
  imageSrc1: 'https://play.teleporthq.io/static/svg/default-img.svg',
  iD: 'UserID',
  followStatusbutton: 'Blocked',
  text1: 'Text',
  blockDate: 'Block Date:',
  rootClassName: '',
  imageAlt: 'image',
  text: 'Text',
  imageSrc: 'https://play.teleporthq.io/static/svg/default-img.svg',
}

Chatuser.propTypes = {
  name: PropTypes.string,
  imageAlt1: PropTypes.string,
  imageSrc1: PropTypes.string,
  iD: PropTypes.string,
  followStatusbutton: PropTypes.string,
  text1: PropTypes.string,
  blockDate: PropTypes.string,
  rootClassName: PropTypes.string,
  imageAlt: PropTypes.string,
  text: PropTypes.string,
  imageSrc: PropTypes.string,
}

export default Chatuser
