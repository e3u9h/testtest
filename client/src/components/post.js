import React from 'react'

import { DateTimePrimitive } from '@teleporthq/react-components'
import PropTypes from 'prop-types'

import './post.css'

const Post = (props) => {
  return (
    <div className={`post-container ${props.rootClassName} `}>
      <div className="post-container1">
        <img alt={props.imageAlt} src={props.imageSrc} className="post-image" />
        <span className="post-text">{props.text}</span>
        <span className="post-date-time">
          <DateTimePrimitive
            format="DD/MM/YYYY"
            date={props.dateTime}
            className=""
          ></DateTimePrimitive>
        </span>
      </div>
      <div className="post-container2">
        <span className="">{props.text1}</span>
      </div>
      <div className="post-container3">
        <svg viewBox="0 0 1024 1024" className="post-icon">
          <path
            d="M768 342v-86h-512v86h512zM768 470v-86h-512v86h512zM768 598v-86h-512v86h512zM854 86q34 0 59 25t25 59v512q0 34-25 60t-59 26h-598l-170 170v-768q0-34 25-59t59-25h684z"
            className=""
          ></path>
        </svg>
        <div className="post-container4">
          <span className="">{props.comments}</span>
        </div>
        <svg viewBox="0 0 1024 1024" className="post-icon2">
          <path
            d="M950.857 340.571c0-160.571-108.571-194.286-200-194.286-85.143 0-181.143 92-210.857 127.429-13.714 16.571-42.286 16.571-56 0-29.714-35.429-125.714-127.429-210.857-127.429-91.429 0-200 33.714-200 194.286 0 104.571 105.714 201.714 106.857 202.857l332 320 331.429-319.429c1.714-1.714 107.429-98.857 107.429-203.429zM1024 340.571c0 137.143-125.714 252-130.857 257.143l-356 342.857c-6.857 6.857-16 10.286-25.143 10.286s-18.286-3.429-25.143-10.286l-356.571-344c-4.571-4-130.286-118.857-130.286-256 0-167.429 102.286-267.429 273.143-267.429 100 0 193.714 78.857 238.857 123.429 45.143-44.571 138.857-123.429 238.857-123.429 170.857 0 273.143 100 273.143 267.429z"
            className=""
          ></path>
        </svg>
        <div className="post-container5">
          <span className="">{props.likes}</span>
        </div>
        <svg viewBox="0 0 1024 1024" className="post-icon4">
          <path
            d="M755.188 64c148.382 0 268.812 120.44 268.812 268.832 0 292.21-315.824 382.842-511.978 679.418-207.522-298.424-512.022-377.572-512.022-679.418 0-148.392 120.426-268.832 268.808-268.832 60.354 0 115.99 27.53 160.796 67.834l-77.604 124.166 224 128-128 320 352-384-224-128 61.896-92.846c35.42-21.768 75.21-35.154 117.292-35.154z"
            className=""
          ></path>
        </svg>
        <div className="post-container6">
          <span className="">{props.likes1}</span>
        </div>
        <svg viewBox="0 0 1024 1024" className="post-icon6">
          <path
            d="M810 298h86v256h-648l154 154-60 60-256-256 256-256 60 60-154 154h562v-172z"
            className=""
          ></path>
        </svg>
        <div className="post-container7">
          <span className="">{props.reposts1}</span>
        </div>
      </div>
    </div>
  )
}

Post.defaultProps = {
  text1: 'Hello world!',
  comments: '0',
  reposts1: '0',
  likes1: '0',
  rootClassName: '',
  reposts: '0',
  text: 'GroupA1 Student',
  imageAlt: 'image',
  imageSrc:
    '/external/%C3%A5%C2%BE%C2%AE%C3%A4%C2%BF%C2%A1%C3%A5%C2%9B%C2%BE%C3%A7%C2%89%C2%87_20240323020804-200h.jpg',
  likes: '0',
  dateTime: 'Fri Mar 22 2024 23:40:41 GMT+0800 (中国标准时间)',
}

Post.propTypes = {
  text1: PropTypes.string,
  comments: PropTypes.string,
  reposts1: PropTypes.string,
  likes1: PropTypes.string,
  rootClassName: PropTypes.string,
  reposts: PropTypes.string,
  text: PropTypes.string,
  imageAlt: PropTypes.string,
  imageSrc: PropTypes.string,
  likes: PropTypes.string,
  dateTime: PropTypes.string,
}

export default Post
