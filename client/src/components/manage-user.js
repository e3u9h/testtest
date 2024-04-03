import React from 'react'

import PropTypes from 'prop-types'

import './manage-user.css'

const ManageUserComponent = (props) => {
  return (
    <div className={`manage-user-container ${props.rootClassName} `}>
      <div className="manage-user-container1">
        <div className="manage-user-container2"></div>
        <div className="manage-user-container3">
          <div className="manage-user-container4">
            <span className="manage-user-text">{props.name}</span>
            <div className="manage-user-container5">
              <span className="manage-user-text1">{props.iD}</span>
            </div>
          </div>
        </div>
        <button type="button" className="manage-user-button button">
          {props.followStatusbutton1}
        </button>
        <button type="button" className="manage-user-button1 button">
          {props.followStatusbutton2}
        </button>
        <button type="button" className="manage-user-button2 button">
          {props.followStatusbutton21}
        </button>
        <span className="manage-user-text2">{props.notChange}</span>
        <span className="manage-user-text3">{props.blockDate}</span>
      </div>
    </div>
  )
}

ManageUserComponent.defaultProps = {
  followStatusbutton2: 'delete',
  iD: 'UserID',
  notChange: 'Register Date:',
  rootClassName: '',
  name: 'user',
  followStatusbutton1: 'Blocked',
  followStatusbutton21: 'view',
  blockDate: 'Datehere',
}

ManageUserComponent.propTypes = {
  followStatusbutton2: PropTypes.string,
  iD: PropTypes.string,
  notChange: PropTypes.string,
  rootClassName: PropTypes.string,
  name: PropTypes.string,
  followStatusbutton1: PropTypes.string,
  followStatusbutton21: PropTypes.string,
  blockDate: PropTypes.string,
}

export default ManageUserComponent
