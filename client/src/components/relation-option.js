import React from 'react'

import PropTypes from 'prop-types'

import './relation-option.css'

const RelationOption = (props) => {
  return (
    <div className={`relation-option-container ${props.rootClassName} `}>
      <select>
        <option value="Option 1">Following</option>
        <option value="Option 1">Unfollow</option>
        <option value="Option 1">Blocked</option>
      </select>
    </div>
  )
}

RelationOption.defaultProps = {
  rootClassName: '',
}

RelationOption.propTypes = {
  rootClassName: PropTypes.string,
}

export default RelationOption
