import React from 'react'

import PropTypes from 'prop-types'

import './component7.css'

const Component7 = (props) => {
  return (
    <div className={`component7-container ${props.rootClassName} `}>
      <div
        data-thq="thq-dropdown"
        className="component7-thq-dropdown list-item"
      >
        <div
          data-thq="thq-dropdown-toggle"
          className="component7-dropdown-toggle"
        >
          <img
            alt={props.imageAlt}
            src={props.imageSrc}
            className="component7-image"
          />
        </div>
        <ul data-thq="thq-dropdown-list" className="component7-dropdown-list">
          <li data-thq="thq-dropdown" className="component7-dropdown list-item">
            <div
              data-thq="thq-dropdown-toggle"
              className="component7-dropdown-toggle1"
            >
              <span className="component7-text">{props.text8}</span>
            </div>
          </li>
          <li
            data-thq="thq-dropdown"
            className="component7-dropdown1 list-item"
          >
            <div
              data-thq="thq-dropdown-toggle"
              className="component7-dropdown-toggle2"
            >
              <span className="component7-text1">{props.text9}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}

Component7.defaultProps = {
  text6: 'GroupA1 Student',
  text9: 'Reset Password',
  imageSrc:
    '/external/%C3%A5%C2%BE%C2%AE%C3%A4%C2%BF%C2%A1%C3%A5%C2%9B%C2%BE%C3%A7%C2%89%C2%87_20240323020804-200h.jpg',
  text7: 'id: 001',
  rootClassName: '',
  text8: 'Logout',
  imageAlt: 'image',
}

Component7.propTypes = {
  text6: PropTypes.string,
  text9: PropTypes.string,
  imageSrc: PropTypes.string,
  text7: PropTypes.string,
  rootClassName: PropTypes.string,
  text8: PropTypes.string,
  imageAlt: PropTypes.string,
}

export default Component7
