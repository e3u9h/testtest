import React from 'react'

import { DateTimePrimitive } from '@teleporthq/react-components'
import PropTypes from 'prop-types'

import './component3.css'

const Component3 = (props) => {
  return (
    <div className="component3-container">
      <div className="component3-container1">
        <img
          alt={props.imageAlt}
          src={props.imageSrc}
          className="component3-image"
        />
        <div className="component3-container2">
          <span className="component3-text">{props.text}</span>
        </div>
        <span className="component3-date-time">
          <DateTimePrimitive
            format="DD/MM/YYYY"
            date="Fri Mar 22 2024 23:41:41 GMT+0800 (中国标准时间)"
          ></DateTimePrimitive>
        </span>
      </div>
      <div className="component3-container3">
        <article className="component3-container4">
          <span className="component3-text1">
            <span>What a nice day today!</span>
            <br></br>
            <span>I am going to CSCI3100 classs !</span>
            <br></br>
            <span>HAPPY~</span>
            <br></br>
          </span>
        </article>
      </div>
    </div>
  )
}

Component3.defaultProps = {
  imageSrc:
    '/external/%C3%A5%C2%BE%C2%AE%C3%A4%C2%BF%C2%A1%C3%A5%C2%9B%C2%BE%C3%A7%C2%89%C2%87_20240323020804-200h.jpg',
  text: 'Love3100\n',
  imageAlt: 'image',
}

Component3.propTypes = {
  imageSrc: PropTypes.string,
  text: PropTypes.string,
  imageAlt: PropTypes.string,
}

export default Component3
