import React from 'react'

import PropTypes from 'prop-types'

import './header.css'

const Header = (props) => {
  return (
    <div className={`header-header ${props.rootClassName} `}>
      <img alt={props.imageAlt} src={props.imageSrc} className="header-image" />
      <div className="header-container"></div>
      <div className="header-container1">
        <div data-thq="thq-navbar-nav" className="header-desktop-menu"></div>
      </div>
    </div>
  )
}

Header.defaultProps = {
  logo: 'C3u',
  rootClassName: '',
  imageSrc: '/external/wechatimg148-200h.jpg',
  button: 'search',
  textinputPlaceholder: 'search',
  imageAlt: 'image',
}

Header.propTypes = {
  logo: PropTypes.string,
  rootClassName: PropTypes.string,
  imageSrc: PropTypes.string,
  button: PropTypes.string,
  textinputPlaceholder: PropTypes.string,
  imageAlt: PropTypes.string,
}

export default Header
