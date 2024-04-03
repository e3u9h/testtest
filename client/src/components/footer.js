import React from 'react'

import PropTypes from 'prop-types'

import './footer.css'

const Footer = (props) => {
  return (
    <footer className={`footer-footer footerContainer ${props.rootClassName} `}>
      <div className="footer-container">
        <span className="logo">C3U</span>
        <nav className="footer-nav">
          <span className="bodySmall">{props.nav12}</span>
          <span className="footer-nav22 bodySmall">{props.nav22}</span>
          <span className="footer-nav32 bodySmall">{props.nav32}</span>
          <span className="footer-nav42 bodySmall">{props.nav42}</span>
          <span className="footer-nav421">{props.nav421}</span>
          <span className="footer-nav52 bodySmall">{props.nav52}</span>
        </nav>
      </div>
      <div className="footer-separator"></div>
      <div className="footer-container1">
        <span className="bodySmall footer-text">{props.text}</span>
        <div className="footer-icon-group"></div>
      </div>
    </footer>
  )
}

Footer.defaultProps = {
  nav22: 'Explore',
  nav52: 'Settings',
  rootClassName: '',
  nav421: 'Profile\n',
  nav42: 'Messages',
  nav32: 'Notifications',
  logo: 'C3U',
  text: 'CSCI3100 2024Spring Group A1',
  nav12: 'Home',
}

Footer.propTypes = {
  nav22: PropTypes.string,
  nav52: PropTypes.string,
  rootClassName: PropTypes.string,
  nav421: PropTypes.string,
  nav42: PropTypes.string,
  nav32: PropTypes.string,
  logo: PropTypes.string,
  text: PropTypes.string,
  nav12: PropTypes.string,
}

export default Footer
