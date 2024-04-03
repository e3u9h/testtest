import React from 'react'
import { Link } from 'react-router-dom'

import { DateTimePrimitive } from '@teleporthq/react-components'
import { Helmet } from 'react-helmet'

import Chatuser from '../components/chatuser'
import Footer from '../components/footer'
import './chatroom.css'

const Chatroom = (props) => {
  return (
    <div className="chatroom-container">
      <Helmet>
        <title>Chatroom - Downright Previous Termite</title>
        <meta
          property="og:title"
          content="Chatroom - Downright Previous Termite"
        />
      </Helmet>
      <div className="chatroom-container01">
        <div className="chatroom-sidebar">
          <nav className="chatroom-nav">
            <div className="chatroom-container02">
              <svg
                viewBox="0 0 950.8571428571428 1024"
                className="chatroom-icon"
              >
                <path d="M804.571 566.857v274.286c0 20-16.571 36.571-36.571 36.571h-219.429v-219.429h-146.286v219.429h-219.429c-20 0-36.571-16.571-36.571-36.571v-274.286c0-1.143 0.571-2.286 0.571-3.429l328.571-270.857 328.571 270.857c0.571 1.143 0.571 2.286 0.571 3.429zM932 527.429l-35.429 42.286c-2.857 3.429-7.429 5.714-12 6.286h-1.714c-4.571 0-8.571-1.143-12-4l-395.429-329.714-395.429 329.714c-4 2.857-8.571 4.571-13.714 4-4.571-0.571-9.143-2.857-12-6.286l-35.429-42.286c-6.286-7.429-5.143-19.429 2.286-25.714l410.857-342.286c24-20 62.857-20 86.857 0l139.429 116.571v-111.429c0-10.286 8-18.286 18.286-18.286h109.714c10.286 0 18.286 8 18.286 18.286v233.143l125.143 104c7.429 6.286 8.571 18.286 2.286 25.714z"></path>
              </svg>
              <Link to="/" className="chatroom-navlink">
                Home
              </Link>
            </div>
            <div className="chatroom-container03">
              <svg
                viewBox="0 0 950.8571428571428 1024"
                className="chatroom-icon02"
              >
                <path d="M658.286 475.429c0-141.143-114.857-256-256-256s-256 114.857-256 256 114.857 256 256 256 256-114.857 256-256zM950.857 950.857c0 40-33.143 73.143-73.143 73.143-19.429 0-38.286-8-51.429-21.714l-196-195.429c-66.857 46.286-146.857 70.857-228 70.857-222.286 0-402.286-180-402.286-402.286s180-402.286 402.286-402.286 402.286 180 402.286 402.286c0 81.143-24.571 161.143-70.857 228l196 196c13.143 13.143 21.143 32 21.143 51.429z"></path>
              </svg>
              <span className="chatroom-text">Search</span>
            </div>
            <div className="chatroom-container04"></div>
            <div className="chatroom-container05">
              <svg viewBox="0 0 1024 1024" className="chatroom-icon04">
                <path d="M521.143 969.143c0-5.143-4-9.143-9.143-9.143-45.143 0-82.286-37.143-82.286-82.286 0-5.143-4-9.143-9.143-9.143s-9.143 4-9.143 9.143c0 55.429 45.143 100.571 100.571 100.571 5.143 0 9.143-4 9.143-9.143zM140.571 804.571h742.857c-102.286-115.429-152-272-152-475.429 0-73.714-69.714-182.857-219.429-182.857s-219.429 109.143-219.429 182.857c0 203.429-49.714 360-152 475.429zM987.429 804.571c0 40-33.143 73.143-73.143 73.143h-256c0 80.571-65.714 146.286-146.286 146.286s-146.286-65.714-146.286-146.286h-256c-40 0-73.143-33.143-73.143-73.143 84.571-71.429 182.857-199.429 182.857-475.429 0-109.714 90.857-229.714 242.286-252-2.857-6.857-4.571-14.286-4.571-22.286 0-30.286 24.571-54.857 54.857-54.857s54.857 24.571 54.857 54.857c0 8-1.714 15.429-4.571 22.286 151.429 22.286 242.286 142.286 242.286 252 0 276 98.286 404 182.857 475.429z"></path>
              </svg>
              <span className="chatroom-text01">Notifications</span>
            </div>
            <div className="chatroom-container06">
              <svg viewBox="0 0 1024 1024" className="chatroom-icon06">
                <path d="M804.571 438.857c0 161.714-180 292.571-402.286 292.571-34.857 0-68.571-3.429-100.571-9.143-47.429 33.714-101.143 58.286-158.857 73.143-15.429 4-32 6.857-49.143 9.143h-1.714c-8.571 0-16.571-6.857-18.286-16.571v0c-2.286-10.857 5.143-17.714 11.429-25.143 22.286-25.143 47.429-47.429 66.857-94.857-92.571-53.714-152-136.571-152-229.143 0-161.714 180-292.571 402.286-292.571s402.286 130.857 402.286 292.571zM1024 585.143c0 93.143-59.429 175.429-152 229.143 19.429 47.429 44.571 69.714 66.857 94.857 6.286 7.429 13.714 14.286 11.429 25.143v0c-2.286 10.286-10.857 17.714-20 16.571-17.143-2.286-33.714-5.143-49.143-9.143-57.714-14.857-111.429-39.429-158.857-73.143-32 5.714-65.714 9.143-100.571 9.143-103.429 0-198.286-28.571-269.714-75.429 16.571 1.143 33.714 2.286 50.286 2.286 122.857 0 238.857-35.429 327.429-99.429 95.429-69.714 148-164 148-266.286 0-29.714-4.571-58.857-13.143-86.857 96.571 53.143 159.429 137.714 159.429 233.143z"></path>
              </svg>
              <span className="chatroom-text02">Messages</span>
            </div>
            <div className="chatroom-container07">
              <svg
                viewBox="0 0 731.4285714285713 1024"
                className="chatroom-icon08"
              >
                <path d="M731.429 799.429c0 83.429-54.857 151.429-121.714 151.429h-488c-66.857 0-121.714-68-121.714-151.429 0-150.286 37.143-324 186.857-324 46.286 45.143 109.143 73.143 178.857 73.143s132.571-28 178.857-73.143c149.714 0 186.857 173.714 186.857 324zM585.143 292.571c0 121.143-98.286 219.429-219.429 219.429s-219.429-98.286-219.429-219.429 98.286-219.429 219.429-219.429 219.429 98.286 219.429 219.429z"></path>
              </svg>
              <Link to="/profile" className="chatroom-navlink1">
                Profile
              </Link>
            </div>
            <div className="chatroom-container08">
              <svg
                viewBox="0 0 877.7142857142857 1024"
                className="chatroom-icon10"
              >
                <path d="M585.143 512c0-80.571-65.714-146.286-146.286-146.286s-146.286 65.714-146.286 146.286 65.714 146.286 146.286 146.286 146.286-65.714 146.286-146.286zM877.714 449.714v126.857c0 8.571-6.857 18.857-16 20.571l-105.714 16c-6.286 18.286-13.143 35.429-22.286 52 19.429 28 40 53.143 61.143 78.857 3.429 4 5.714 9.143 5.714 14.286s-1.714 9.143-5.143 13.143c-13.714 18.286-90.857 102.286-110.286 102.286-5.143 0-10.286-2.286-14.857-5.143l-78.857-61.714c-16.571 8.571-34.286 16-52 21.714-4 34.857-7.429 72-16.571 106.286-2.286 9.143-10.286 16-20.571 16h-126.857c-10.286 0-19.429-7.429-20.571-17.143l-16-105.143c-17.714-5.714-34.857-12.571-51.429-21.143l-80.571 61.143c-4 3.429-9.143 5.143-14.286 5.143s-10.286-2.286-14.286-6.286c-30.286-27.429-70.286-62.857-94.286-96-2.857-4-4-8.571-4-13.143 0-5.143 1.714-9.143 4.571-13.143 19.429-26.286 40.571-51.429 60-78.286-9.714-18.286-17.714-37.143-23.429-56.571l-104.571-15.429c-9.714-1.714-16.571-10.857-16.571-20.571v-126.857c0-8.571 6.857-18.857 15.429-20.571l106.286-16c5.714-18.286 13.143-35.429 22.286-52.571-19.429-27.429-40-53.143-61.143-78.857-3.429-4-5.714-8.571-5.714-13.714s2.286-9.143 5.143-13.143c13.714-18.857 90.857-102.286 110.286-102.286 5.143 0 10.286 2.286 14.857 5.714l78.857 61.143c16.571-8.571 34.286-16 52-21.714 4-34.857 7.429-72 16.571-106.286 2.286-9.143 10.286-16 20.571-16h126.857c10.286 0 19.429 7.429 20.571 17.143l16 105.143c17.714 5.714 34.857 12.571 51.429 21.143l81.143-61.143c3.429-3.429 8.571-5.143 13.714-5.143s10.286 2.286 14.286 5.714c30.286 28 70.286 63.429 94.286 97.143 2.857 3.429 4 8 4 12.571 0 5.143-1.714 9.143-4.571 13.143-19.429 26.286-40.571 51.429-60 78.286 9.714 18.286 17.714 37.143 23.429 56l104.571 16c9.714 1.714 16.571 10.857 16.571 20.571z"></path>
              </svg>
              <span className="chatroom-text03">Settings</span>
            </div>
            <div className="chatroom-container09"></div>
            <button type="button" className="chatroom-button mybutton button">
              Post
            </button>
          </nav>
          <div className="chatroom-profile">
            <div
              data-thq="thq-dropdown"
              className="chatroom-thq-dropdown list-item"
            >
              <div
                data-thq="thq-dropdown-toggle"
                className="chatroom-dropdown-toggle"
              >
                <img
                  alt="image"
                  src="/external/%C3%A5%C2%BE%C2%AE%C3%A4%C2%BF%C2%A1%C3%A5%C2%9B%C2%BE%C3%A7%C2%89%C2%87_20240323020804-200h.jpg"
                  className="chatroom-image"
                />
                <div className="chatroom-container10">
                  <span className="chatroom-text04">GroupA1 Student</span>
                  <span className="chatroom-text05">id: 001</span>
                </div>
                <div
                  data-thq="thq-dropdown-arrow"
                  className="chatroom-dropdown-arrow"
                ></div>
              </div>
              <ul
                data-thq="thq-dropdown-list"
                className="chatroom-dropdown-list"
              >
                <li
                  data-thq="thq-dropdown"
                  className="chatroom-dropdown list-item"
                >
                  <div
                    data-thq="thq-dropdown-toggle"
                    className="chatroom-dropdown-toggle1"
                  >
                    <span className="chatroom-text06">Logout</span>
                  </div>
                </li>
                <li
                  data-thq="thq-dropdown"
                  className="chatroom-dropdown1 list-item"
                >
                  <div
                    data-thq="thq-dropdown-toggle"
                    className="chatroom-dropdown-toggle2"
                  >
                    <span className="chatroom-text07">Reset Password</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <img
          alt="image"
          src="/external/wechatimg148-200h.jpg"
          className="chatroom-image1"
        />
      </div>
      <div className="chatroom-container11">
        <div className="chatroom-container12">
          <h1 className="chatroom-text08">
            <span className="chatroom-text09">Michael</span>
            <br></br>
          </h1>
          <img
            alt="image"
            src="/939c893b87c4ad883673a20256f6e256-200h.jpg"
            className="chatroom-image2"
          />
          <svg viewBox="0 0 1024 1024" className="chatroom-icon12">
            <path d="M512 854q140 0 241-101t101-241-101-241-241-101-241 101-101 241 101 241 241 101zM512 86q176 0 301 125t125 301-125 301-301 125-301-125-125-301 125-301 301-125zM470 298h84v256h-84v-256zM470 640h84v86h-84v-86z"></path>
          </svg>
        </div>
        <div className="chatroom-container13">
          <div className="chatroom-container14">
            <div className="chatroom-container15">
              <textarea
                placeholder="Send Message..."
                className="chatroom-textarea textarea input"
              ></textarea>
            </div>
            <svg viewBox="0 0 1024 1024" className="chatroom-icon14">
              <path d="M512 746q-74 0-133-41t-85-107h70q50 84 148 84t148-84h70q-26 66-85 107t-133 41zM512 854q140 0 241-101t101-241-101-241-241-101-241 101-101 241 101 241 241 101zM512 86q176 0 301 125t125 301-125 301-301 125-301-125-125-301 125-301 301-125zM362 470q-26 0-45-19t-19-45 19-45 45-19 45 19 19 45-19 45-45 19zM662 470q-26 0-45-19t-19-45 19-45 45-19 45 19 19 45-19 45-45 19z"></path>
            </svg>
            <svg viewBox="0 0 1024 1024" className="chatroom-icon16">
              <path d="M512 854q140 0 241-101t101-241-101-241-241-101-241 101-101 241 101 241 241 101zM512 86q176 0 301 125t125 301-125 301-301 125-301-125-125-301 125-301 301-125zM554 298v172h172v84h-172v172h-84v-172h-172v-84h172v-172h84z"></path>
            </svg>
            <button type="button" className="chatroom-button1 button">
              Send
            </button>
          </div>
          <div className="chatroom-container16">
            <textarea
              placeholder="how was your day?"
              className="chatroom-textarea1 textarea"
            ></textarea>
            <span className="chatroom-date-time">
              <DateTimePrimitive
                format="MMM D, YYYY h:mm A"
                date="Thu Mar 26 2024 16:04:12 GMT+0800 (Hong Kong Standard Time)"
              ></DateTimePrimitive>
            </span>
          </div>
          <div className="chatroom-container17">
            <textarea
              placeholder="I have just finished part of my csci3100 proj"
              className="chatroom-textarea2 textarea"
            ></textarea>
            <span className="chatroom-date-time1">
              <DateTimePrimitive
                format="MMM D, YYYY h:mm A"
                date="Thu Mar 26 2024 16:05:12 GMT+0800 (Hong Kong Standard Time)"
              ></DateTimePrimitive>
            </span>
          </div>
          <div className="chatroom-container18">
            <textarea
              placeholder="It is a nice project"
              className="chatroom-textarea3 textarea"
            ></textarea>
            <span className="chatroom-date-time2">
              <DateTimePrimitive
                format="MMM D, YYYY h:mm A"
                date="Thu Mar 26 2024 16:05:12 GMT+0800 (Hong Kong Standard Time)"
              ></DateTimePrimitive>
            </span>
          </div>
          <div className="chatroom-container19">
            <textarea
              placeholder="well i am hungry now "
              className="chatroom-textarea4 textarea"
            ></textarea>
            <span className="chatroom-date-time3">
              <DateTimePrimitive
                format="MMM D, YYYY h:mm A"
                date="Thu Mar 26 2024 17:25:12 GMT+0800 (Hong Kong Standard Time)"
              ></DateTimePrimitive>
            </span>
          </div>
          <div className="chatroom-container20">
            <textarea
              placeholder="lets go out to dinner?"
              className="chatroom-textarea5 textarea"
            ></textarea>
            <span className="chatroom-date-time4">
              <DateTimePrimitive
                format="MMM D, YYYY h:mm A"
                date="Thu Mar 26 2024 17:25:12 GMT+0800 (Hong Kong Standard Time)"
              ></DateTimePrimitive>
            </span>
          </div>
          <div className="chatroom-container21">
            <textarea
              placeholder="no"
              className="chatroom-textarea6 textarea"
            ></textarea>
            <span className="chatroom-date-time5">
              <DateTimePrimitive
                format="MMM D, YYYY h:mm A"
                date="Thu Mar 27 2024 11:19:12 GMT+0800 (Hong Kong Standard Time)"
              ></DateTimePrimitive>
            </span>
          </div>
        </div>
      </div>
      <div className="chatroom-sidebar1">
        <div className="chatroom-container22">
          <span className="chatroom-text11">Messages</span>
          <input
            type="text"
            placeholder="Search Messages or User"
            className="chatroom-textinput input"
          />
          <svg viewBox="0 0 1024 1024" className="chatroom-icon18">
            <path d="M726 470v-86h-172v-170h-84v170h-172v86h172v170h84v-170h172zM938 170v768l-170-170h-598q-34 0-59-26t-25-60v-512q0-34 25-59t59-25h684q34 0 59 25t25 59z"></path>
          </svg>
        </div>
        <div className="chatroom-container23">
          <div className="chatroom-container24">
            <div className="chatroom-container25">
              <Chatuser
                iD="003"
                name="Michael"
                imageAlt="/939c893b87c4ad883673a20256f6e256-200h.jpg"
                imageSrc="/939c893b87c4ad883673a20256f6e256-200h.jpg"
                imageSrc1="/939c893b87c4ad883673a20256f6e256-200h.jpg"
                rootClassName="chatuser-root-class-name4"
              ></Chatuser>
              <Chatuser
                iD="004"
                name="Love3100"
                imageSrc1="/97e4cf398c1c453f98f8135b202479d6-200h.jpg"
                rootClassName="chatuser-root-class-name5"
              ></Chatuser>
              <Chatuser
                iD="005"
                name="TeacherHa"
                imageSrc1="/download%201-200h.jpg"
                rootClassName="chatuser-root-class-name7"
              ></Chatuser>
              <Chatuser
                iD="006"
                name="3100BigFan"
                imageSrc1="/uqaqhuvavt0-200h.jpg"
                rootClassName="chatuser-root-class-name6"
              ></Chatuser>
            </div>
          </div>
        </div>
      </div>
      <Footer rootClassName="footer-root-class-name13"></Footer>
    </div>
  )
}

export default Chatroom
