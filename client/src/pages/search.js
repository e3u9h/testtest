import React from 'react'

import { Helmet } from 'react-helmet'

import LeftSidebar from '../components/left-sidebar'
import Footer from '../components/footer'
import './search.css'

const Search = (props) => {
  return (
    <div className="search-container">
      <Helmet>
        <title>search - Downright Previous Termite</title>
        <meta
          property="og:title"
          content="search - Downright Previous Termite"
        />
      </Helmet>
      <div className="search-container01">
        <div className="search-container02">
          <img
            alt="image"
            src="/external/wechatimg148-200h.jpg"
            className="search-image"
          />
        </div>
        <div className="search-container03">
          <input
            type="text"
            placeholder="search"
            className="search-textinput input"
          />
        </div>
        <div data-thq="thq-dropdown" className="search-thq-dropdown list-item">
          <div
            data-thq="thq-dropdown-toggle"
            className="search-dropdown-toggle"
          >
            <span className="search-text">Select Kind</span>
            <div
              data-thq="thq-dropdown-arrow"
              className="search-dropdown-arrow"
            >
              <svg viewBox="0 0 1024 1024" className="search-icon">
                <path d="M426 726v-428l214 214z"></path>
              </svg>
            </div>
          </div>
          <ul data-thq="thq-dropdown-list" className="search-dropdown-list">
            <li data-thq="thq-dropdown" className="search-dropdown list-item">
              <div
                data-thq="thq-dropdown-toggle"
                className="search-dropdown-toggle1"
              >
                <span className="search-text01">User</span>
              </div>
            </li>
            <li data-thq="thq-dropdown" className="search-dropdown1 list-item">
              <div
                data-thq="thq-dropdown-toggle"
                className="search-dropdown-toggle2"
              >
                <span className="search-text02">Post</span>
              </div>
            </li>
            <li
              data-thq="thq-dropdown"
              className="search-dropdown2 list-item"
            ></li>
          </ul>
        </div>
      </div>
      <div className="search-container04">
        <div className="search-hero">
          <div className="search-container05">
            <div className="search-sidebar">
              <LeftSidebar rootClassName="left-sidebar-root-class-name9"></LeftSidebar>
            </div>
          </div>
          <div className="search-container06">
            <div className="search-container07">
              <span className="search-text03">location Recommendations</span>
              <svg viewBox="0 0 1024 1024" className="search-icon2">
                <path d="M512 950.857c-9.143 0-18.286-3.429-25.143-10.286l-356.571-344c-4.571-4-130.286-118.857-130.286-256 0-167.429 102.286-267.429 273.143-267.429 100 0 193.714 78.857 238.857 123.429 45.143-44.571 138.857-123.429 238.857-123.429 170.857 0 273.143 100 273.143 267.429 0 137.143-125.714 252-130.857 257.143l-356 342.857c-6.857 6.857-16 10.286-25.143 10.286z"></path>
              </svg>
            </div>
            <div className="search-container08">
              <span className="search-text04">Trending in HongKong SAR</span>
              <span className="search-text05">Gruop A1 works so hard!</span>
              <span className="search-text06">Post 2 months ago</span>
            </div>
            <div className="search-container09">
              <span className="search-text07">Trending in HongKong SAR</span>
              <span className="search-text08">Hong Kong is so hot.</span>
              <span className="search-text09">Post 5 days ago</span>
            </div>
          </div>
          <div className="search-container10">
            <div className="search-container11">
              <span className="search-text10">Tag Recommendations</span>
              <svg viewBox="0 0 1024 1024" className="search-icon4">
                <path d="M512 950.857c-9.143 0-18.286-3.429-25.143-10.286l-356.571-344c-4.571-4-130.286-118.857-130.286-256 0-167.429 102.286-267.429 273.143-267.429 100 0 193.714 78.857 238.857 123.429 45.143-44.571 138.857-123.429 238.857-123.429 170.857 0 273.143 100 273.143 267.429 0 137.143-125.714 252-130.857 257.143l-356 342.857c-6.857 6.857-16 10.286-25.143 10.286z"></path>
              </svg>
            </div>
            <div className="search-container12">
              <span className="search-text11">Trending in #CUHK</span>
              <span className="search-text12">
                CSCI3100 project will due soon :(
              </span>
              <span className="search-text13">Post 3 days ago</span>
            </div>
            <div className="search-container13">
              <span className="search-text14">Trending in #CUHK</span>
              <span className="search-text15">
                Holiday is coming, Easter’s Monday
              </span>
              <span className="search-text16">Post 1 days ago</span>
            </div>
          </div>
        </div>
      </div>
      <div className="search-features"></div>
      <div className="search-pricing"></div>
      <div className="search-banner"></div>
      <div className="search-faq">
        <div className="search-faq-container faqContainer"></div>
      </div>
      <Footer rootClassName="footer-root-class-name2"></Footer>
    </div>
  )
}

export default Search
