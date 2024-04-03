import React from 'react'

import PropTypes from 'prop-types'

import './right-sidebar.css'

const RightSidebar = (props) => {
  return (
    <div className={`right-sidebar-sidebar ${props.rootClassName} `}>
      <div className="right-sidebar-nav-item">
        <h1 className="right-sidebar-text">{props.text}</h1>
        <div className="right-sidebar-options">
          <h2 className="right-sidebar-text1">{props.text2}</h2>
          <h3 className="right-sidebar-text2">{props.text22}</h3>
          <h3 className="right-sidebar-text3">Hong Kong is so hot.</h3>
        </div>
      </div>
      <div className="right-sidebar-options1">
        <h2 className="right-sidebar-text4">Tag Recommendations</h2>
        <h3 className="right-sidebar-text5">CSCI3100 project will due soon!</h3>
        <h3 className="right-sidebar-text6">{props.text11}</h3>
      </div>
    </div>
  )
}

RightSidebar.defaultProps = {
  text1: "Holiday is coming, Easter's Monday.",
  text21: 'GroupA1 works so hard!',
  text: 'Trends',
  text3: 'CSCI3100 project will due soon:(',
  text211: 'CSCI3100 project will due soon!',
  rootClassName: '',
  text2: 'Location Recommendations',
  text11: "Holiday is coming, Easter's Monday.",
  text22: 'GroupA1 works so hard!',
}

RightSidebar.propTypes = {
  text1: PropTypes.string,
  text21: PropTypes.string,
  text: PropTypes.string,
  text3: PropTypes.string,
  text211: PropTypes.string,
  rootClassName: PropTypes.string,
  text2: PropTypes.string,
  text11: PropTypes.string,
  text22: PropTypes.string,
}

export default RightSidebar
