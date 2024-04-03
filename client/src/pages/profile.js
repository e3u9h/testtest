import React from 'react'
import { Link } from 'react-router-dom'

import { Helmet } from 'react-helmet'

import Header from '../components/header'
import Post from '../components/post'
import RightSidebar from '../components/right-sidebar'
import Footer from '../components/footer'
import './profile.css'

const Profile = (props) => {
  return (
    <div className="profile-container">
      <Helmet>
        <title>Profile - Downright Previous Termite</title>
        <meta
          property="og:title"
          content="Profile - Downright Previous Termite"
        />
      </Helmet>
      <div className="profile-container01">
        <div className="profile-container02"></div>
      </div>
      <Header rootClassName="header-root-class-name"></Header>
      <div className="profile-container03">
        <div className="profile-hero">
          <div className="profile-sidebar">
            <nav className="profile-nav">
              <div className="profile-container04">
                <svg
                  viewBox="0 0 950.8571428571428 1024"
                  className="profile-icon"
                >
                  <path d="M804.571 566.857v274.286c0 20-16.571 36.571-36.571 36.571h-219.429v-219.429h-146.286v219.429h-219.429c-20 0-36.571-16.571-36.571-36.571v-274.286c0-1.143 0.571-2.286 0.571-3.429l328.571-270.857 328.571 270.857c0.571 1.143 0.571 2.286 0.571 3.429zM932 527.429l-35.429 42.286c-2.857 3.429-7.429 5.714-12 6.286h-1.714c-4.571 0-8.571-1.143-12-4l-395.429-329.714-395.429 329.714c-4 2.857-8.571 4.571-13.714 4-4.571-0.571-9.143-2.857-12-6.286l-35.429-42.286c-6.286-7.429-5.143-19.429 2.286-25.714l410.857-342.286c24-20 62.857-20 86.857 0l139.429 116.571v-111.429c0-10.286 8-18.286 18.286-18.286h109.714c10.286 0 18.286 8 18.286 18.286v233.143l125.143 104c7.429 6.286 8.571 18.286 2.286 25.714z"></path>
                </svg>
                <Link to="/" className="profile-navlink">
                  Home
                </Link>
              </div>
              <div className="profile-container05">
                <svg
                  viewBox="0 0 950.8571428571428 1024"
                  className="profile-icon02"
                >
                  <path d="M658.286 475.429c0-141.143-114.857-256-256-256s-256 114.857-256 256 114.857 256 256 256 256-114.857 256-256zM950.857 950.857c0 40-33.143 73.143-73.143 73.143-19.429 0-38.286-8-51.429-21.714l-196-195.429c-66.857 46.286-146.857 70.857-228 70.857-222.286 0-402.286-180-402.286-402.286s180-402.286 402.286-402.286 402.286 180 402.286 402.286c0 81.143-24.571 161.143-70.857 228l196 196c13.143 13.143 21.143 32 21.143 51.429z"></path>
                </svg>
                <Link to="/search" className="profile-navlink1">
                  Search
                </Link>
              </div>
              <div className="profile-container06"></div>
              <div className="profile-container07">
                <svg viewBox="0 0 1024 1024" className="profile-icon04">
                  <path d="M521.143 969.143c0-5.143-4-9.143-9.143-9.143-45.143 0-82.286-37.143-82.286-82.286 0-5.143-4-9.143-9.143-9.143s-9.143 4-9.143 9.143c0 55.429 45.143 100.571 100.571 100.571 5.143 0 9.143-4 9.143-9.143zM140.571 804.571h742.857c-102.286-115.429-152-272-152-475.429 0-73.714-69.714-182.857-219.429-182.857s-219.429 109.143-219.429 182.857c0 203.429-49.714 360-152 475.429zM987.429 804.571c0 40-33.143 73.143-73.143 73.143h-256c0 80.571-65.714 146.286-146.286 146.286s-146.286-65.714-146.286-146.286h-256c-40 0-73.143-33.143-73.143-73.143 84.571-71.429 182.857-199.429 182.857-475.429 0-109.714 90.857-229.714 242.286-252-2.857-6.857-4.571-14.286-4.571-22.286 0-30.286 24.571-54.857 54.857-54.857s54.857 24.571 54.857 54.857c0 8-1.714 15.429-4.571 22.286 151.429 22.286 242.286 142.286 242.286 252 0 276 98.286 404 182.857 475.429z"></path>
                </svg>
                <span className="profile-text">Notifications</span>
              </div>
              <div className="profile-container08">
                <svg viewBox="0 0 1024 1024" className="profile-icon06">
                  <path d="M804.571 438.857c0 161.714-180 292.571-402.286 292.571-34.857 0-68.571-3.429-100.571-9.143-47.429 33.714-101.143 58.286-158.857 73.143-15.429 4-32 6.857-49.143 9.143h-1.714c-8.571 0-16.571-6.857-18.286-16.571v0c-2.286-10.857 5.143-17.714 11.429-25.143 22.286-25.143 47.429-47.429 66.857-94.857-92.571-53.714-152-136.571-152-229.143 0-161.714 180-292.571 402.286-292.571s402.286 130.857 402.286 292.571zM1024 585.143c0 93.143-59.429 175.429-152 229.143 19.429 47.429 44.571 69.714 66.857 94.857 6.286 7.429 13.714 14.286 11.429 25.143v0c-2.286 10.286-10.857 17.714-20 16.571-17.143-2.286-33.714-5.143-49.143-9.143-57.714-14.857-111.429-39.429-158.857-73.143-32 5.714-65.714 9.143-100.571 9.143-103.429 0-198.286-28.571-269.714-75.429 16.571 1.143 33.714 2.286 50.286 2.286 122.857 0 238.857-35.429 327.429-99.429 95.429-69.714 148-164 148-266.286 0-29.714-4.571-58.857-13.143-86.857 96.571 53.143 159.429 137.714 159.429 233.143z"></path>
                </svg>
                <span className="profile-text01">Messages</span>
              </div>
              <div className="profile-container09">
                <svg
                  viewBox="0 0 731.4285714285713 1024"
                  className="profile-icon08"
                >
                  <path d="M731.429 799.429c0 83.429-54.857 151.429-121.714 151.429h-488c-66.857 0-121.714-68-121.714-151.429 0-150.286 37.143-324 186.857-324 46.286 45.143 109.143 73.143 178.857 73.143s132.571-28 178.857-73.143c149.714 0 186.857 173.714 186.857 324zM585.143 292.571c0 121.143-98.286 219.429-219.429 219.429s-219.429-98.286-219.429-219.429 98.286-219.429 219.429-219.429 219.429 98.286 219.429 219.429z"></path>
                </svg>
                <Link to="/profile" className="profile-navlink2">
                  Profile
                </Link>
              </div>
              <div className="profile-container10">
                <svg
                  viewBox="0 0 877.7142857142857 1024"
                  className="profile-icon10"
                >
                  <path d="M585.143 512c0-80.571-65.714-146.286-146.286-146.286s-146.286 65.714-146.286 146.286 65.714 146.286 146.286 146.286 146.286-65.714 146.286-146.286zM877.714 449.714v126.857c0 8.571-6.857 18.857-16 20.571l-105.714 16c-6.286 18.286-13.143 35.429-22.286 52 19.429 28 40 53.143 61.143 78.857 3.429 4 5.714 9.143 5.714 14.286s-1.714 9.143-5.143 13.143c-13.714 18.286-90.857 102.286-110.286 102.286-5.143 0-10.286-2.286-14.857-5.143l-78.857-61.714c-16.571 8.571-34.286 16-52 21.714-4 34.857-7.429 72-16.571 106.286-2.286 9.143-10.286 16-20.571 16h-126.857c-10.286 0-19.429-7.429-20.571-17.143l-16-105.143c-17.714-5.714-34.857-12.571-51.429-21.143l-80.571 61.143c-4 3.429-9.143 5.143-14.286 5.143s-10.286-2.286-14.286-6.286c-30.286-27.429-70.286-62.857-94.286-96-2.857-4-4-8.571-4-13.143 0-5.143 1.714-9.143 4.571-13.143 19.429-26.286 40.571-51.429 60-78.286-9.714-18.286-17.714-37.143-23.429-56.571l-104.571-15.429c-9.714-1.714-16.571-10.857-16.571-20.571v-126.857c0-8.571 6.857-18.857 15.429-20.571l106.286-16c5.714-18.286 13.143-35.429 22.286-52.571-19.429-27.429-40-53.143-61.143-78.857-3.429-4-5.714-8.571-5.714-13.714s2.286-9.143 5.143-13.143c13.714-18.857 90.857-102.286 110.286-102.286 5.143 0 10.286 2.286 14.857 5.714l78.857 61.143c16.571-8.571 34.286-16 52-21.714 4-34.857 7.429-72 16.571-106.286 2.286-9.143 10.286-16 20.571-16h126.857c10.286 0 19.429 7.429 20.571 17.143l16 105.143c17.714 5.714 34.857 12.571 51.429 21.143l81.143-61.143c3.429-3.429 8.571-5.143 13.714-5.143s10.286 2.286 14.286 5.714c30.286 28 70.286 63.429 94.286 97.143 2.857 3.429 4 8 4 12.571 0 5.143-1.714 9.143-4.571 13.143-19.429 26.286-40.571 51.429-60 78.286 9.714 18.286 17.714 37.143 23.429 56l104.571 16c9.714 1.714 16.571 10.857 16.571 20.571z"></path>
                </svg>
                <span className="profile-text02">Settings</span>
              </div>
              <div className="profile-container11"></div>
              <button type="button" className="profile-button mybutton button">
                Post
              </button>
            </nav>
            <div className="profile-profile">
              <div
                data-thq="thq-dropdown"
                className="profile-thq-dropdown list-item"
              >
                <div
                  data-thq="thq-dropdown-toggle"
                  className="profile-dropdown-toggle"
                >
                  <img
                    alt="image"
                    src="/external/%C3%A5%C2%BE%C2%AE%C3%A4%C2%BF%C2%A1%C3%A5%C2%9B%C2%BE%C3%A7%C2%89%C2%87_20240323020804-200h.jpg"
                    className="profile-image"
                  />
                  <div className="profile-container12">
                    <span className="profile-text03">GroupA1 Student</span>
                    <span className="profile-text04">id: 001</span>
                  </div>
                  <div
                    data-thq="thq-dropdown-arrow"
                    className="profile-dropdown-arrow"
                  ></div>
                </div>
                <ul
                  data-thq="thq-dropdown-list"
                  className="profile-dropdown-list"
                >
                  <li
                    data-thq="thq-dropdown"
                    className="profile-dropdown list-item"
                  >
                    <div
                      data-thq="thq-dropdown-toggle"
                      className="profile-dropdown-toggle1"
                    >
                      <span className="profile-text05">Logout</span>
                    </div>
                  </li>
                  <li
                    data-thq="thq-dropdown"
                    className="profile-dropdown1 list-item"
                  >
                    <div
                      data-thq="thq-dropdown-toggle"
                      className="profile-dropdown-toggle2"
                    >
                      <span className="profile-text06">Reset Password</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="profile-hero1 heroContainer">
            <div className="profile-container13">
              <img
                alt="image"
                src="/external/%C3%A5%C2%BE%C2%AE%C3%A4%C2%BF%C2%A1%C3%A5%C2%9B%C2%BE%C3%A7%C2%89%C2%87_20240323020804-200h.jpg"
                className="profile-image1"
              />
              <div className="profile-container14">
                <div className="profile-container15">
                  <h1 className="profile-heading">GroupA1 Student</h1>
                </div>
                <div className="profile-container16">
                  <div className="profile-container17">
                    <span id="bio" className="profileinfo">
                      Hello! I am a student taking CSCI3100.
                    </span>
                    <span id="userid" className="profileinfo">
                      id: 001
                    </span>
                    <span id="email" className="profile-text09 profileinfo">
                      email: 1155123456@link.cuhk.edu.hk
                    </span>
                    <div className="profile-container18">
                      <span className="profile-text10 profileinfo">
                        gender: female
                      </span>
                      <span className="profileinfo">age: 21</span>
                    </div>
                    <span className="profile-text12 profileinfo">
                      location: CUHK
                    </span>
                    <div className="profile-container19">
                      <Link
                        to="/follower-page"
                        id="followers"
                        className="profile-navlink3 profileinfo"
                      >
                        followers: 4
                      </Link>
                      <Link
                        to="/friendlist"
                        id="following"
                        className="profile-navlink4 profileinfo"
                      >
                        folllowing: 4
                      </Link>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="profile-button1 mybutton button"
                >
                  <span className="profile-text13">Edit Profile</span>
                </button>
              </div>
            </div>
            <div className="profile-container20">
              <div className="profile-container21">
                <Post
                  text1="Test dislike."
                  likes1="1"
                  rootClassName="post-root-class-name4"
                ></Post>
                <Post></Post>
              </div>
            </div>
          </div>
          <RightSidebar rootClassName="right-sidebar-root-class-name6"></RightSidebar>
        </div>
      </div>
      <div className="profile-features"></div>
      <div className="profile-pricing"></div>
      <div className="profile-banner"></div>
      <div className="profile-faq">
        <div className="profile-faq-container faqContainer"></div>
      </div>
      <Footer rootClassName="footer-root-class-name"></Footer>
    </div>
  )
}

export default Profile
