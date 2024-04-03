import React from 'react'

import { DateTimePrimitive } from '@teleporthq/react-components'
import PropTypes from 'prop-types'

import './component5.css'

const Component5 = (props) => {
  return (
    <div className="component5-container">
      <img
        alt={props.imageAlt}
        src={props.imageSrc}
        className="component5-image"
      />
      <div className="component5-container1">
        <span className="component5-text">{props.text}</span>
      </div>
      <span className="component5-date-time">
        <DateTimePrimitive
          format="DD/MM/YYYY"
          date="Fri Mar 22 2024 23:41:41 GMT+0800 (中国标准时间)"
        ></DateTimePrimitive>
      </span>
    </div>
  )
}

Component5.defaultProps = {
  imageAlt: 'image',
  imageSrc:
    '/external/%C3%A5%C2%BE%C2%AE%C3%A4%C2%BF%C2%A1%C3%A5%C2%9B%C2%BE%C3%A7%C2%89%C2%87_20240323020804-200h.jpg',
  text: 'Love3100\n',
}

Component5.propTypes = {
  imageAlt: PropTypes.string,
  imageSrc: PropTypes.string,
  text: PropTypes.string,
}

export default Component5
