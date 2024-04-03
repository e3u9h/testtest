import React from 'react'

import PropTypes from 'prop-types'

import './component9.css'

const Component9 = (props) => {
  return (
    <div className="component9-container">
      <button type="button" className="component9-button button">
        {props.button}
      </button>
    </div>
  )
}

Component9.defaultProps = {
  button: 'Find it',
}

Component9.propTypes = {
  button: PropTypes.string,
}

export default Component9
