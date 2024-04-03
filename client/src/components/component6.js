import React from 'react'

import PropTypes from 'prop-types'

import './component6.css'

const Component6 = (props) => {
  return (
    <div className="component6-container">
      <span className="component6-text">{props.text}</span>
    </div>
  )
}

Component6.defaultProps = {
  text: 'Love3100\n',
}

Component6.propTypes = {
  text: PropTypes.string,
}

export default Component6
