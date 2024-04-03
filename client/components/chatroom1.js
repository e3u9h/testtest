import React from 'react'

import PropTypes from 'prop-types'

import Chatuser from './chatuser'
import './chatroom1.css'

const Chatroom1 = (props) => {
  return (
    <div className={`chatroom1-sidebar ${props.rootClassName} `}>
      <div className="chatroom1-container">
        <span className="chatroom1-text">{props.chatroomHeader}</span>
        <input
          type="text"
          placeholder={props.textinputPlaceholder}
          className="chatroom1-textinput input"
        />
        <svg viewBox="0 0 1024 1024" className="chatroom1-icon">
          <path d="M726 470v-86h-172v-170h-84v170h-172v86h172v170h84v-170h172zM938 170v768l-170-170h-598q-34 0-59-26t-25-60v-512q0-34 25-59t59-25h684q34 0 59 25t25 59z"></path>
        </svg>
      </div>
      <div className="chatroom1-container1">
        <div className="chatroom1-container2">
          <div className="chatroom1-container3">
            <Chatuser
              iD="002"
              name="Micheal"
              imageSrc1="/939c893b87c4ad883673a20256f6e256-200h.jpg"
              rootClassName="chatuser-root-class-name"
            ></Chatuser>
            <Chatuser
              iD="003"
              name="StudentKK"
              imageSrc1="/bluelinee-200h.png"
              rootClassName="chatuser-root-class-name1"
            ></Chatuser>
            <Chatuser
              iD="004"
              name="TeacherTao"
              imageSrc1="/download%201-200h.jpg"
              rootClassName="chatuser-root-class-name3"
            ></Chatuser>
            <Chatuser
              iD="005"
              name="Bestty"
              rootClassName="chatuser-root-class-name2"
            ></Chatuser>
          </div>
        </div>
      </div>
    </div>
  )
}

Chatroom1.defaultProps = {
  rootClassName1: '',
  chatroomHeader: 'Messages',
  textinputPlaceholder: 'Search Messages or User',
  rootClassName2: '',
  rootClassName: '',
}

Chatroom1.propTypes = {
  rootClassName1: PropTypes.string,
  chatroomHeader: PropTypes.string,
  textinputPlaceholder: PropTypes.string,
  rootClassName2: PropTypes.string,
  rootClassName: PropTypes.string,
}

export default Chatroom1
