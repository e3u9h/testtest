import React from 'react'

import PropTypes from 'prop-types'

import './following.css'

const Following = (props) => {
  return (
    <div className={`following-container ${props.rootClassName} `}>
      <div className="following-container1">
        <div className="following-container2">
          <img
            alt={props.imageAlt}
            src={props.imageSrc}
            className="following-image"
          />
        </div>
        <div className="following-container3">
          <span className="following-text">{props.name}</span>
          <div className="following-container4">
            <span className="following-text1">{props.iD}</span>
          </div>
          <span className="following-text2">{props.intro}</span>
          <button type="button" className="following-button button">
            {props.button}
          </button>
        </div>
      </div>
    </div>
  )
}

Following.defaultProps = {
  imageAlt: 'image',
  intro: 'Selfintro',
  imageSrc: 'https://play.teleporthq.io/static/svg/default-img.svg',
  button: 'Following',
  name: 'Username',
  followStatusbutton: 'Follow',
  rootClassName: '',
  iD: 'UserID',
}

Following.propTypes = {
  imageAlt: PropTypes.string,
  intro: PropTypes.string,
  imageSrc: PropTypes.string,
  button: PropTypes.string,
  name: PropTypes.string,
  followStatusbutton: PropTypes.string,
  rootClassName: PropTypes.string,
  iD: PropTypes.string,
}

export default Following
