import React from 'react'

import PropTypes from 'prop-types'

import './component.css'

const AppComponent = (props) => {
  return (
    <div className="app-component-container">
      <span>{props.text}</span>
    </div>
  )
}

AppComponent.defaultProps = {
  text: '3',
}

AppComponent.propTypes = {
  text: PropTypes.string,
}

export default AppComponent
