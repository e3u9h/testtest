import React from 'react'

import PropTypes from 'prop-types'

import './component10.css'

const Component10 = (props) => {
  return (
    <div className="component10-container">
      <button type="button" className="button">
        {props.button}
      </button>
    </div>
  )
}

Component10.defaultProps = {
  button: 'Button',
}

Component10.propTypes = {
  button: PropTypes.string,
}

export default Component10
