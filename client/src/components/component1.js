import React from 'react'

import PropTypes from 'prop-types'

import './component1.css'

const Component1 = (props) => {
  return (
    <div className="component1-container">
      <span className="component1-text">{props.text}</span>
    </div>
  )
}

Component1.defaultProps = {
  text: 'CUHK',
}

Component1.propTypes = {
  text: PropTypes.string,
}

export default Component1
