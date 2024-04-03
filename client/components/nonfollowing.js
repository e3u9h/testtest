import React from 'react'

import PropTypes from 'prop-types'

import './nonfollowing.css'

const Nonfollowing = (props) => {
  return (
    <div className={`nonfollowing-container ${props.rootClassName} `}>
      <div className="nonfollowing-container1">
        <div className="nonfollowing-container2">
          <img
            alt={props.imageAlt}
            src={props.imageSrc}
            className="nonfollowing-image"
          />
        </div>
        <div className="nonfollowing-container3">
          <span className="nonfollowing-text">{props.name}</span>
          <button type="button" className="nonfollowing-button button">
            {props.followStatusbutton}
          </button>
          <div className="nonfollowing-container4">
            <span className="nonfollowing-text1">{props.iD}</span>
          </div>
          <span className="nonfollowing-text2">{props.intro}</span>
        </div>
      </div>
    </div>
  )
}

Nonfollowing.defaultProps = {
  followStatusbutton: 'Follow',
  name: 'Username',
  imageSrc: 'https://play.teleporthq.io/static/svg/default-img.svg',
  rootClassName: '',
  imageAlt: 'image',
  selfintroArea: 'Selfintro',
  intro: 'Selfintro',
  iD: 'UserID',
}

Nonfollowing.propTypes = {
  followStatusbutton: PropTypes.string,
  name: PropTypes.string,
  imageSrc: PropTypes.string,
  rootClassName: PropTypes.string,
  imageAlt: PropTypes.string,
  selfintroArea: PropTypes.string,
  intro: PropTypes.string,
  iD: PropTypes.string,
}

export default Nonfollowing
