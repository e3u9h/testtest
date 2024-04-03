import React from 'react'
import { Link } from 'react-router-dom'

import { Helmet } from 'react-helmet'

import Header from '../components/header'
import LeftSidebar from '../components/left-sidebar'
import Post from '../components/post'
import RightSidebar from '../components/right-sidebar'
import Footer from '../components/footer'
import './profileanotheruser.css'

const Profileanotheruser = (props) => {
  return (
    <div className="profileanotheruser-container">
      <Helmet>
        <title>Profileanotheruser - Downright Previous Termite</title>
        <meta
          property="og:title"
          content="Profileanotheruser - Downright Previous Termite"
        />
      </Helmet>
      <div className="profileanotheruser-container01">
        <div className="profileanotheruser-container02"></div>
      </div>
      <Header rootClassName="header-root-class-name1"></Header>
      <div className="profileanotheruser-container03">
        <div className="profileanotheruser-hero">
          <LeftSidebar rootClassName="left-sidebar-root-class-name1"></LeftSidebar>
          <div className="profileanotheruser-hero1 heroContainer">
            <div className="profileanotheruser-container04">
              <img
                alt="image"
                src="/97e4cf398c1c453f98f8135b202479d6-200h.jpg"
                className="profileanotheruser-image"
              />
              <div className="profileanotheruser-container05">
                <div className="profileanotheruser-container06">
                  <button
                    type="button"
                    className="profileanotheruser-button mybutton button"
                  >
                    Block
                  </button>
                </div>
                <div className="profileanotheruser-container07">
                  <h1 className="profileanotheruser-heading">Love3100</h1>
                </div>
                <div className="profileanotheruser-container08">
                  <div className="profileanotheruser-container09">
                    <span className="profileinfo">CGPA 3.979</span>
                    <span className="profileinfo">id: 004</span>
                    <span className="profileanotheruser-text2 profileinfo">
                      email: 1155123460@link.cuhk.edu.hk
                    </span>
                    <div className="profileanotheruser-container10">
                      <span className="profileanotheruser-text3 profileinfo">
                        gender: female
                      </span>
                      <span className="profileinfo">age: 21</span>
                    </div>
                    <span className="profileanotheruser-text5 profileinfo">
                      location: CUHK
                    </span>
                    <div className="profileanotheruser-container11">
                      <Link
                        to="/follower-page"
                        className="profileanotheruser-navlink profileinfo"
                      >
                        followers: 4
                      </Link>
                      <Link
                        to="/friendlist"
                        className="profileanotheruser-navlink1 profileinfo"
                      >
                        folllowing: 4
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="profileanotheruser-container12">
                  <button
                    type="button"
                    className="profileanotheruser-button1 mybutton button"
                  >
                    <span className="profileanotheruser-text6">Unfollow</span>
                  </button>
                  <button
                    type="button"
                    className="profileanotheruser-button2 mybutton button"
                  >
                    <span className="profileanotheruser-text7">
                      Private Chat
                    </span>
                  </button>
                </div>
              </div>
            </div>
            <div className="profileanotheruser-container13">
              <div className="profileanotheruser-container14">
                <Post
                  text="Love3100"
                  likes="5"
                  text1="I love CSCI3100 very much!"
                  comments="2"
                  dateTime="Fri Feb 28 2024 14:36:41 GMT+0800 (中国标准时间)"
                  imageSrc="/97e4cf398c1c453f98f8135b202479d6-200h.jpg"
                  rootClassName="post-root-class-name8"
                ></Post>
                <Post
                  text="Love3100"
                  likes="10"
                  text1="CSCI3100 is a very good course!"
                  comments="3"
                  dateTime="Fri Feb 27 2024 14:36:41 GMT+0800 (中国标准时间)"
                  imageSrc="/97e4cf398c1c453f98f8135b202479d6-200h.jpg"
                  rootClassName="post-root-class-name9"
                ></Post>
              </div>
            </div>
          </div>
          <RightSidebar rootClassName="right-sidebar-root-class-name7"></RightSidebar>
        </div>
      </div>
      <div className="profileanotheruser-features"></div>
      <div className="profileanotheruser-pricing"></div>
      <div className="profileanotheruser-banner"></div>
      <div className="profileanotheruser-faq">
        <div className="profileanotheruser-faq-container faqContainer"></div>
      </div>
      <Footer rootClassName="footer-root-class-name16"></Footer>
    </div>
  )
}

export default Profileanotheruser
