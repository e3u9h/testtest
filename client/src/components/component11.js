import React from 'react'

import { DateTimePrimitive } from '@teleporthq/react-components'
import PropTypes from 'prop-types'

import Component1 from './component1'
import Component2 from './component2'
import AppComponent from './component'
import './component11.css'

const Component11 = (props) => {
  return (
    <div className="component11-container">
      <div className="component11-container01">
        <img
          alt={props.imageAlt}
          src={props.imageSrc}
          className="component11-image"
        />
        <Component1></Component1>
        <span className="component11-date-time">
          <DateTimePrimitive
            format="DD/MM/YYYY"
            date="Fri Mar 22 2024 23:41:41 GMT+0800 (中国标准时间)"
          ></DateTimePrimitive>
        </span>
      </div>
      <div className="component11-container02">
        <Component2></Component2>
        <img
          alt={props.imageAlt1}
          src={props.imageSrc1}
          className="component11-image1"
        />
        <div className="component11-container03">
          <img
            alt={props.imageAlt2}
            src={props.imageSrc2}
            className="component11-image2"
          />
          <div className="component11-container04">
            <span className="component11-text">{props.text2}</span>
          </div>
          <span className="component11-date-time1">
            <DateTimePrimitive
              format="DD/MM/YYYY"
              date="Fri Mar 22 2024 23:41:41 GMT+0800 (中国标准时间)"
            ></DateTimePrimitive>
          </span>
        </div>
      </div>
      <div className="component11-container05">
        <div className="component11-container06">
          <span className="component11-text01">
            <span>What a nice day today!</span>
            <br></br>
            <span>I am going to have CSCI3100 classs !</span>
            <br></br>
            <span>HAPPY~</span>
            <br></br>
          </span>
          <div className="component11-container07">
            <svg viewBox="0 0 1024 1024" className="component11-icon">
              <path d="M768 342v-86h-512v86h512zM768 470v-86h-512v86h512zM768 598v-86h-512v86h512zM854 86q34 0 59 25t25 59v512q0 34-25 60t-59 26h-598l-170 170v-768q0-34 25-59t59-25h684z"></path>
            </svg>
            <div className="component11-container08">
              <span>{props.text3}</span>
            </div>
            <svg viewBox="0 0 1024 1024" className="component11-icon02">
              <path d="M512 853.333c-8.32 0-16.683-2.432-23.936-7.339-9.6-6.443-235.008-159.147-304.896-229.163-78.123-78.123-87.168-161.152-87.168-216.832 0-126.464 102.869-229.333 229.333-229.333 76.885 0 144.981 38.016 186.667 96.256 41.685-58.24 109.781-96.256 186.667-96.256 126.464 0 229.333 102.869 229.333 229.333 0 55.68-9.045 138.709-87.168 216.832-70.016 70.016-295.381 222.72-304.896 229.163-7.253 4.907-15.616 7.339-23.936 7.339zM325.333 256c-79.403 0-144 64.597-144 144 0 46.635 7.381 101.717 62.165 156.501 51.712 51.712 208.341 161.067 268.501 202.496 60.16-41.429 216.789-150.784 268.501-202.496 54.784-54.784 62.165-109.867 62.165-156.501 0-79.403-64.597-144-144-144s-144 64.597-144 144c0 23.552-19.072 42.667-42.667 42.667s-42.667-19.115-42.667-42.667c0-79.403-64.597-144-144-144z"></path>
            </svg>
            <div className="component11-container09">
              <span>{props.text4}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="component11-container10">
        <div className="component11-container11">
          <img
            alt={props.imageAlt3}
            src={props.imageSrc3}
            className="component11-image3"
          />
          <div className="component11-container12">
            <div className="component11-container13">
              <span className="component11-text10">{props.text5}</span>
            </div>
          </div>
          <span className="component11-date-time2">
            <DateTimePrimitive
              format="DD/MM/YYYY"
              date="Fri Mar 22 2024 23:41:41 GMT+0800 (中国标准时间)"
            ></DateTimePrimitive>
          </span>
        </div>
        <div className="component11-container14">
          <span className="component11-text11">
            <span>Hope I can get a good grade at course CSCI3100~</span>
            <br></br>
            <span>Love 3100~</span>
            <br></br>
          </span>
          <div className="component11-container15">
            <svg viewBox="0 0 1024 1024" className="component11-icon04">
              <path d="M768 342v-86h-512v86h512zM768 470v-86h-512v86h512zM768 598v-86h-512v86h512zM854 86q34 0 59 25t25 59v512q0 34-25 60t-59 26h-598l-170 170v-768q0-34 25-59t59-25h684z"></path>
            </svg>
            <div className="component11-container16">
              <span>{props.text6}</span>
            </div>
            <svg viewBox="0 0 1024 1024" className="component11-icon06">
              <path d="M512 853.333c-8.32 0-16.683-2.432-23.936-7.339-9.6-6.443-235.008-159.147-304.896-229.163-78.123-78.123-87.168-161.152-87.168-216.832 0-126.464 102.869-229.333 229.333-229.333 76.885 0 144.981 38.016 186.667 96.256 41.685-58.24 109.781-96.256 186.667-96.256 126.464 0 229.333 102.869 229.333 229.333 0 55.68-9.045 138.709-87.168 216.832-70.016 70.016-295.381 222.72-304.896 229.163-7.253 4.907-15.616 7.339-23.936 7.339zM325.333 256c-79.403 0-144 64.597-144 144 0 46.635 7.381 101.717 62.165 156.501 51.712 51.712 208.341 161.067 268.501 202.496 60.16-41.429 216.789-150.784 268.501-202.496 54.784-54.784 62.165-109.867 62.165-156.501 0-79.403-64.597-144-144-144s-144 64.597-144 144c0 23.552-19.072 42.667-42.667 42.667s-42.667-19.115-42.667-42.667c0-79.403-64.597-144-144-144z"></path>
            </svg>
            <div className="component11-container17">
              <span>{props.text7}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="component11-container18">
        <div className="component11-container19">
          <img
            alt={props.imageAlt4}
            src={props.imageSrc4}
            className="component11-image4"
          />
          <div className="component11-container20">
            <div className="component11-container21">
              <span className="component11-text18">{props.text8}</span>
            </div>
          </div>
          <span className="component11-date-time3">
            <DateTimePrimitive
              format="DD/MM/YYYY"
              date="Fri Mar 22 2024 23:41:41 GMT+0800 (中国标准时间)"
            ></DateTimePrimitive>
          </span>
        </div>
        <div className="component11-container22">
          <span className="component11-text19">
            <span>I have millions of coupons~</span>
            <br></br>
          </span>
          <div className="component11-container23">
            <svg viewBox="0 0 1024 1024" className="component11-icon08">
              <path d="M768 342v-86h-512v86h512zM768 470v-86h-512v86h512zM768 598v-86h-512v86h512zM854 86q34 0 59 25t25 59v512q0 34-25 60t-59 26h-598l-170 170v-768q0-34 25-59t59-25h684z"></path>
            </svg>
            <div className="component11-container24">
              <span>{props.text9}</span>
            </div>
            <svg viewBox="0 0 1024 1024" className="component11-icon10">
              <path d="M512 853.333c-8.32 0-16.683-2.432-23.936-7.339-9.6-6.443-235.008-159.147-304.896-229.163-78.123-78.123-87.168-161.152-87.168-216.832 0-126.464 102.869-229.333 229.333-229.333 76.885 0 144.981 38.016 186.667 96.256 41.685-58.24 109.781-96.256 186.667-96.256 126.464 0 229.333 102.869 229.333 229.333 0 55.68-9.045 138.709-87.168 216.832-70.016 70.016-295.381 222.72-304.896 229.163-7.253 4.907-15.616 7.339-23.936 7.339zM325.333 256c-79.403 0-144 64.597-144 144 0 46.635 7.381 101.717 62.165 156.501 51.712 51.712 208.341 161.067 268.501 202.496 60.16-41.429 216.789-150.784 268.501-202.496 54.784-54.784 62.165-109.867 62.165-156.501 0-79.403-64.597-144-144-144s-144 64.597-144 144c0 23.552-19.072 42.667-42.667 42.667s-42.667-19.115-42.667-42.667c0-79.403-64.597-144-144-144z"></path>
            </svg>
            <div className="component11-container25">
              <span>{props.text10}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="component11-container26">
        <svg viewBox="0 0 1024 1024" className="component11-icon12">
          <path d="M768 342v-86h-512v86h512zM768 470v-86h-512v86h512zM768 598v-86h-512v86h512zM854 86q34 0 59 25t25 59v512q0 34-25 60t-59 26h-598l-170 170v-768q0-34 25-59t59-25h684z"></path>
        </svg>
        <AppComponent></AppComponent>
        <svg viewBox="0 0 1024 1024" className="component11-icon14">
          <path d="M512 853.333c-8.32 0-16.683-2.432-23.936-7.339-9.6-6.443-235.008-159.147-304.896-229.163-78.123-78.123-87.168-161.152-87.168-216.832 0-126.464 102.869-229.333 229.333-229.333 76.885 0 144.981 38.016 186.667 96.256 41.685-58.24 109.781-96.256 186.667-96.256 126.464 0 229.333 102.869 229.333 229.333 0 55.68-9.045 138.709-87.168 216.832-70.016 70.016-295.381 222.72-304.896 229.163-7.253 4.907-15.616 7.339-23.936 7.339zM325.333 256c-79.403 0-144 64.597-144 144 0 46.635 7.381 101.717 62.165 156.501 51.712 51.712 208.341 161.067 268.501 202.496 60.16-41.429 216.789-150.784 268.501-202.496 54.784-54.784 62.165-109.867 62.165-156.501 0-79.403-64.597-144-144-144s-144 64.597-144 144c0 23.552-19.072 42.667-42.667 42.667s-42.667-19.115-42.667-42.667c0-79.403-64.597-144-144-144z"></path>
        </svg>
        <div className="component11-container27">
          <span>{props.text}</span>
        </div>
        <svg viewBox="0 0 1024 1024" className="component11-icon16">
          <path d="M810 298h86v256h-648l154 154-60 60-256-256 256-256 60 60-154 154h562v-172z"></path>
        </svg>
        <div className="component11-container28">
          <span>{props.text1}</span>
        </div>
      </div>
    </div>
  )
}

Component11.defaultProps = {
  text5: '3100BigFan',
  imageSrc3: '/uqaqhuvavt0-200h.jpg',
  imageSrc2: '/97e4cf398c1c453f98f8135b202479d6-200h.jpg',
  text6: '0',
  text8: 'Michael\n',
  imageAlt2: 'image',
  imageAlt4: 'image',
  imageAlt: 'image',
  text7: '66\n',
  text4: '99\n',
  text1: '0',
  imageSrc: '/download%201-400h.jpg',
  text2: 'Love3100\n',
  text9: '0',
  text: '10\n',
  imageAlt1: 'image',
  text10: '0',
  imageSrc4: '/939c893b87c4ad883673a20256f6e256-200h.jpg',
  imageSrc1: '/download%201-400h.jpg',
  imageAlt3: 'image',
  text3: '0',
}

Component11.propTypes = {
  text5: PropTypes.string,
  imageSrc3: PropTypes.string,
  imageSrc2: PropTypes.string,
  text6: PropTypes.string,
  text8: PropTypes.string,
  imageAlt2: PropTypes.string,
  imageAlt4: PropTypes.string,
  imageAlt: PropTypes.string,
  text7: PropTypes.string,
  text4: PropTypes.string,
  text1: PropTypes.string,
  imageSrc: PropTypes.string,
  text2: PropTypes.string,
  text9: PropTypes.string,
  text: PropTypes.string,
  imageAlt1: PropTypes.string,
  text10: PropTypes.string,
  imageSrc4: PropTypes.string,
  imageSrc1: PropTypes.string,
  imageAlt3: PropTypes.string,
  text3: PropTypes.string,
}

export default Component11
