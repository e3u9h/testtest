import React from 'react'

import { Helmet } from 'react-helmet'

import LeftSidebar from '../components/left-sidebar'
import Footer from '../components/footer'
import './searchuser.css'

const Searchuser = (props) => {
  return (
    <div className="searchuser-container">
      <Helmet>
        <title>searchuser - Downright Previous Termite</title>
        <meta
          property="og:title"
          content="searchuser - Downright Previous Termite"
        />
      </Helmet>
      <div className="searchuser-container1">
        <div className="searchuser-container2">
          <img
            alt="image"
            src="/external/wechatimg148-200h.jpg"
            className="searchuser-image"
          />
        </div>
        <div className="searchuser-container3">
          <input
            type="text"
            placeholder="Michael"
            className="searchuser-textinput input"
          />
        </div>
        <div
          data-thq="thq-dropdown"
          className="searchuser-thq-dropdown list-item"
        >
          <div
            data-thq="thq-dropdown-toggle"
            className="searchuser-dropdown-toggle"
          >
            <span className="searchuser-text">Select Kind</span>
            <div
              data-thq="thq-dropdown-arrow"
              className="searchuser-dropdown-arrow"
            >
              <svg viewBox="0 0 1024 1024" className="searchuser-icon">
                <path d="M426 726v-428l214 214z"></path>
              </svg>
            </div>
          </div>
          <ul data-thq="thq-dropdown-list" className="searchuser-dropdown-list">
            <li
              data-thq="thq-dropdown"
              className="searchuser-dropdown list-item"
            >
              <div
                data-thq="thq-dropdown-toggle"
                className="searchuser-dropdown-toggle1"
              >
                <span className="searchuser-text1">User</span>
              </div>
            </li>
            <li
              data-thq="thq-dropdown"
              className="searchuser-dropdown1 list-item"
            >
              <div
                data-thq="thq-dropdown-toggle"
                className="searchuser-dropdown-toggle2"
              >
                <span className="searchuser-text2">Post</span>
              </div>
            </li>
            <li
              data-thq="thq-dropdown"
              className="searchuser-dropdown2 list-item"
            ></li>
          </ul>
        </div>
      </div>
      <div className="searchuser-container4">
        <div className="searchuser-hero">
          <div className="searchuser-container5">
            <div className="searchuser-sidebar">
              <LeftSidebar rootClassName="left-sidebar-root-class-name8"></LeftSidebar>
            </div>
          </div>
          <div className="searchuser-container6">
            <div className="searchuser-container7">
              <span className="searchuser-text3">
                Results related to &quot;Michael&quot;
              </span>
            </div>
            <div className="searchuser-container8">
              <img
                alt="image"
                src="/939c893b87c4ad883673a20256f6e256-300h.jpg"
                className="searchuser-image1"
              />
              <span className="searchuser-text4">
                I like the sunshine soooo much!
              </span>
              <span className="searchuser-text5">
                <span className="searchuser-text6">Nickname</span>
                <span>: Michael</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="searchuser-features"></div>
      <div className="searchuser-pricing"></div>
      <div className="searchuser-banner"></div>
      <div className="searchuser-faq">
        <div className="searchuser-faq-container faqContainer"></div>
      </div>
      <Footer rootClassName="footer-root-class-name7"></Footer>
    </div>
  )
}

export default Searchuser
