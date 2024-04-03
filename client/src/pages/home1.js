import React from 'react'
import { Link } from 'react-router-dom'

import { DateTimePrimitive } from '@teleporthq/react-components'
import { Helmet } from 'react-helmet'

import AppComponent from '../components/component'
import Post from '../components/post'
import RightSidebar from '../components/right-sidebar'
import Footer from '../components/footer'
import './home1.css'

const Home1 = (props) => {
  return (
    <div className="home1-container">
      <Helmet>
        <title>Downright Previous Termite</title>
        <meta property="og:title" content="Downright Previous Termite" />
      </Helmet>
      <div className="home1-container01">
        <div className="home1-container02">
          <Link to="/search" className="home1-navlink button">
            Search
          </Link>
          <img
            alt="image"
            src="/external/wechatimg148-200h.jpg"
            className="home1-image"
          />
        </div>
      </div>
      <div className="home1-hero">
        <div className="home1-sidebar">
          <nav className="home1-nav">
            <div className="home1-container03">
              <svg viewBox="0 0 950.8571428571428 1024" className="home1-icon">
                <path d="M804.571 566.857v274.286c0 20-16.571 36.571-36.571 36.571h-219.429v-219.429h-146.286v219.429h-219.429c-20 0-36.571-16.571-36.571-36.571v-274.286c0-1.143 0.571-2.286 0.571-3.429l328.571-270.857 328.571 270.857c0.571 1.143 0.571 2.286 0.571 3.429zM932 527.429l-35.429 42.286c-2.857 3.429-7.429 5.714-12 6.286h-1.714c-4.571 0-8.571-1.143-12-4l-395.429-329.714-395.429 329.714c-4 2.857-8.571 4.571-13.714 4-4.571-0.571-9.143-2.857-12-6.286l-35.429-42.286c-6.286-7.429-5.143-19.429 2.286-25.714l410.857-342.286c24-20 62.857-20 86.857 0l139.429 116.571v-111.429c0-10.286 8-18.286 18.286-18.286h109.714c10.286 0 18.286 8 18.286 18.286v233.143l125.143 104c7.429 6.286 8.571 18.286 2.286 25.714z"></path>
              </svg>
              <Link to="/" className="home1-navlink1">
                Home
              </Link>
            </div>
            <div className="home1-container04">
              <svg
                viewBox="0 0 950.8571428571428 1024"
                className="home1-icon02"
              >
                <path d="M658.286 475.429c0-141.143-114.857-256-256-256s-256 114.857-256 256 114.857 256 256 256 256-114.857 256-256zM950.857 950.857c0 40-33.143 73.143-73.143 73.143-19.429 0-38.286-8-51.429-21.714l-196-195.429c-66.857 46.286-146.857 70.857-228 70.857-222.286 0-402.286-180-402.286-402.286s180-402.286 402.286-402.286 402.286 180 402.286 402.286c0 81.143-24.571 161.143-70.857 228l196 196c13.143 13.143 21.143 32 21.143 51.429z"></path>
              </svg>
              <span className="home1-text">
                <span>Search</span>
                <br></br>
              </span>
            </div>
            <div className="home1-container05"></div>
            <div className="home1-container06">
              <svg viewBox="0 0 1024 1024" className="home1-icon04">
                <path d="M521.143 969.143c0-5.143-4-9.143-9.143-9.143-45.143 0-82.286-37.143-82.286-82.286 0-5.143-4-9.143-9.143-9.143s-9.143 4-9.143 9.143c0 55.429 45.143 100.571 100.571 100.571 5.143 0 9.143-4 9.143-9.143zM140.571 804.571h742.857c-102.286-115.429-152-272-152-475.429 0-73.714-69.714-182.857-219.429-182.857s-219.429 109.143-219.429 182.857c0 203.429-49.714 360-152 475.429zM987.429 804.571c0 40-33.143 73.143-73.143 73.143h-256c0 80.571-65.714 146.286-146.286 146.286s-146.286-65.714-146.286-146.286h-256c-40 0-73.143-33.143-73.143-73.143 84.571-71.429 182.857-199.429 182.857-475.429 0-109.714 90.857-229.714 242.286-252-2.857-6.857-4.571-14.286-4.571-22.286 0-30.286 24.571-54.857 54.857-54.857s54.857 24.571 54.857 54.857c0 8-1.714 15.429-4.571 22.286 151.429 22.286 242.286 142.286 242.286 252 0 276 98.286 404 182.857 475.429z"></path>
              </svg>
              <span className="home1-text03">Notifications</span>
            </div>
            <div className="home1-container07">
              <svg viewBox="0 0 1024 1024" className="home1-icon06">
                <path d="M804.571 438.857c0 161.714-180 292.571-402.286 292.571-34.857 0-68.571-3.429-100.571-9.143-47.429 33.714-101.143 58.286-158.857 73.143-15.429 4-32 6.857-49.143 9.143h-1.714c-8.571 0-16.571-6.857-18.286-16.571v0c-2.286-10.857 5.143-17.714 11.429-25.143 22.286-25.143 47.429-47.429 66.857-94.857-92.571-53.714-152-136.571-152-229.143 0-161.714 180-292.571 402.286-292.571s402.286 130.857 402.286 292.571zM1024 585.143c0 93.143-59.429 175.429-152 229.143 19.429 47.429 44.571 69.714 66.857 94.857 6.286 7.429 13.714 14.286 11.429 25.143v0c-2.286 10.286-10.857 17.714-20 16.571-17.143-2.286-33.714-5.143-49.143-9.143-57.714-14.857-111.429-39.429-158.857-73.143-32 5.714-65.714 9.143-100.571 9.143-103.429 0-198.286-28.571-269.714-75.429 16.571 1.143 33.714 2.286 50.286 2.286 122.857 0 238.857-35.429 327.429-99.429 95.429-69.714 148-164 148-266.286 0-29.714-4.571-58.857-13.143-86.857 96.571 53.143 159.429 137.714 159.429 233.143z"></path>
              </svg>
              <span className="home1-text04">Messages</span>
            </div>
            <div className="home1-container08">
              <svg
                viewBox="0 0 731.4285714285713 1024"
                className="home1-icon08"
              >
                <path d="M731.429 799.429c0 83.429-54.857 151.429-121.714 151.429h-488c-66.857 0-121.714-68-121.714-151.429 0-150.286 37.143-324 186.857-324 46.286 45.143 109.143 73.143 178.857 73.143s132.571-28 178.857-73.143c149.714 0 186.857 173.714 186.857 324zM585.143 292.571c0 121.143-98.286 219.429-219.429 219.429s-219.429-98.286-219.429-219.429 98.286-219.429 219.429-219.429 219.429 98.286 219.429 219.429z"></path>
              </svg>
              <Link to="/profile" className="home1-navlink2">
                Profile
              </Link>
            </div>
            <div className="home1-container09">
              <svg
                viewBox="0 0 877.7142857142857 1024"
                className="home1-icon10"
              >
                <path d="M585.143 512c0-80.571-65.714-146.286-146.286-146.286s-146.286 65.714-146.286 146.286 65.714 146.286 146.286 146.286 146.286-65.714 146.286-146.286zM877.714 449.714v126.857c0 8.571-6.857 18.857-16 20.571l-105.714 16c-6.286 18.286-13.143 35.429-22.286 52 19.429 28 40 53.143 61.143 78.857 3.429 4 5.714 9.143 5.714 14.286s-1.714 9.143-5.143 13.143c-13.714 18.286-90.857 102.286-110.286 102.286-5.143 0-10.286-2.286-14.857-5.143l-78.857-61.714c-16.571 8.571-34.286 16-52 21.714-4 34.857-7.429 72-16.571 106.286-2.286 9.143-10.286 16-20.571 16h-126.857c-10.286 0-19.429-7.429-20.571-17.143l-16-105.143c-17.714-5.714-34.857-12.571-51.429-21.143l-80.571 61.143c-4 3.429-9.143 5.143-14.286 5.143s-10.286-2.286-14.286-6.286c-30.286-27.429-70.286-62.857-94.286-96-2.857-4-4-8.571-4-13.143 0-5.143 1.714-9.143 4.571-13.143 19.429-26.286 40.571-51.429 60-78.286-9.714-18.286-17.714-37.143-23.429-56.571l-104.571-15.429c-9.714-1.714-16.571-10.857-16.571-20.571v-126.857c0-8.571 6.857-18.857 15.429-20.571l106.286-16c5.714-18.286 13.143-35.429 22.286-52.571-19.429-27.429-40-53.143-61.143-78.857-3.429-4-5.714-8.571-5.714-13.714s2.286-9.143 5.143-13.143c13.714-18.857 90.857-102.286 110.286-102.286 5.143 0 10.286 2.286 14.857 5.714l78.857 61.143c16.571-8.571 34.286-16 52-21.714 4-34.857 7.429-72 16.571-106.286 2.286-9.143 10.286-16 20.571-16h126.857c10.286 0 19.429 7.429 20.571 17.143l16 105.143c17.714 5.714 34.857 12.571 51.429 21.143l81.143-61.143c3.429-3.429 8.571-5.143 13.714-5.143s10.286 2.286 14.286 5.714c30.286 28 70.286 63.429 94.286 97.143 2.857 3.429 4 8 4 12.571 0 5.143-1.714 9.143-4.571 13.143-19.429 26.286-40.571 51.429-60 78.286 9.714 18.286 17.714 37.143 23.429 56l104.571 16c9.714 1.714 16.571 10.857 16.571 20.571z"></path>
              </svg>
              <span className="home1-text05">Settings</span>
            </div>
            <div className="home1-container10"></div>
            <Link to="/createpost" className="home1-navlink3 mybutton button">
              Post
            </Link>
          </nav>
          <div className="home1-profile">
            <div
              data-thq="thq-dropdown"
              className="home1-thq-dropdown list-item"
            >
              <div
                data-thq="thq-dropdown-toggle"
                className="home1-dropdown-toggle"
              >
                <img
                  alt="image"
                  src="/external/%C3%A5%C2%BE%C2%AE%C3%A4%C2%BF%C2%A1%C3%A5%C2%9B%C2%BE%C3%A7%C2%89%C2%87_20240323020804-200h.jpg"
                  className="home1-image1"
                />
                <div className="home1-container11">
                  <span className="home1-text06">GroupA1 Student</span>
                  <span className="home1-text07">id: 001</span>
                </div>
                <div
                  data-thq="thq-dropdown-arrow"
                  className="home1-dropdown-arrow"
                ></div>
              </div>
              <ul data-thq="thq-dropdown-list" className="home1-dropdown-list">
                <li
                  data-thq="thq-dropdown"
                  className="home1-dropdown list-item"
                >
                  <div
                    data-thq="thq-dropdown-toggle"
                    className="home1-dropdown-toggle1"
                  >
                    <span className="home1-text08">Logout</span>
                  </div>
                </li>
                <li
                  data-thq="thq-dropdown"
                  className="home1-dropdown1 list-item"
                >
                  <div
                    data-thq="thq-dropdown-toggle"
                    className="home1-dropdown-toggle2"
                  >
                    <span className="home1-text09">Reset Password</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="home1-hero1 heroContainer">
          <div className="home1-container12">
            <textarea
              placeholder="edit your post"
              className="home1-textarea textarea"
            ></textarea>
            <div className="home1-container13">
              <svg viewBox="0 0 1024 1024" className="home1-icon12">
                <path d="M832 896h-640v-128l192-320 263 320 185-128v256z"></path>
                <path d="M832 480c0 53.020-42.98 96-96 96-53.022 0-96-42.98-96-96s42.978-96 96-96c53.020 0 96 42.98 96 96z"></path>
                <path d="M917.806 229.076c-22.212-30.292-53.174-65.7-87.178-99.704s-69.412-64.964-99.704-87.178c-51.574-37.82-76.592-42.194-90.924-42.194h-496c-44.112 0-80 35.888-80 80v864c0 44.112 35.888 80 80 80h736c44.112 0 80-35.888 80-80v-624c0-14.332-4.372-39.35-42.194-90.924zM785.374 174.626c30.7 30.7 54.8 58.398 72.58 81.374h-153.954v-153.946c22.984 17.78 50.678 41.878 81.374 72.572zM896 944c0 8.672-7.328 16-16 16h-736c-8.672 0-16-7.328-16-16v-864c0-8.672 7.328-16 16-16 0 0 495.956-0.002 496 0v224c0 17.672 14.326 32 32 32h224v624z"></path>
              </svg>
              <svg viewBox="0 0 1024 1024" className="home1-icon16">
                <path d="M726 448l170-170v468l-170-170v150q0 18-13 30t-31 12h-512q-18 0-30-12t-12-30v-428q0-18 12-30t30-12h512q18 0 31 12t13 30v150z"></path>
              </svg>
              <button type="button" className="home1-button mybutton button">
                Post
              </button>
            </div>
          </div>
          <div className="home1-container14">
            <div className="home1-container15">
              <div className="home1-container16">
                <div className="home1-container17">
                  <img
                    alt="image"
                    src="/939c893b87c4ad883673a20256f6e256-200h.jpg"
                    className="home1-image2"
                  />
                  <span className="home1-text10">Michael </span>
                  <span className="home1-date-time">
                    <DateTimePrimitive
                      format="h:mm MM/DD/YYYY"
                      date="Fri Mar 26 2024 10:40:41 GMT+0800 (中国标准时间)"
                    ></DateTimePrimitive>
                  </span>
                </div>
                <div className="home1-container18">
                  <span className="home1-text11">
                    <span>Many coupons for my students~</span>
                    <br></br>
                    <span className="home1-text14"># CSCI3100</span>
                    <br></br>
                  </span>
                  <span></span>
                </div>
                <div className="home1-container19">
                  <svg viewBox="0 0 1024 1024" className="home1-icon18">
                    <path d="M768 342v-86h-512v86h512zM768 470v-86h-512v86h512zM768 598v-86h-512v86h512zM854 86q34 0 59 25t25 59v512q0 34-25 60t-59 26h-598l-170 170v-768q0-34 25-59t59-25h684z"></path>
                  </svg>
                  <AppComponent></AppComponent>
                  <svg viewBox="0 0 1024 1024" className="home1-icon20">
                    <path d="M950.857 340.571c0-160.571-108.571-194.286-200-194.286-85.143 0-181.143 92-210.857 127.429-13.714 16.571-42.286 16.571-56 0-29.714-35.429-125.714-127.429-210.857-127.429-91.429 0-200 33.714-200 194.286 0 104.571 105.714 201.714 106.857 202.857l332 320 331.429-319.429c1.714-1.714 107.429-98.857 107.429-203.429zM1024 340.571c0 137.143-125.714 252-130.857 257.143l-356 342.857c-6.857 6.857-16 10.286-25.143 10.286s-18.286-3.429-25.143-10.286l-356.571-344c-4.571-4-130.286-118.857-130.286-256 0-167.429 102.286-267.429 273.143-267.429 100 0 193.714 78.857 238.857 123.429 45.143-44.571 138.857-123.429 238.857-123.429 170.857 0 273.143 100 273.143 267.429z"></path>
                  </svg>
                  <div className="home1-container20">
                    <span>
                      <span>10</span>
                      <br></br>
                    </span>
                  </div>
                  <svg viewBox="0 0 1024 1024" className="home1-icon22">
                    <path d="M755.188 64c148.382 0 268.812 120.44 268.812 268.832 0 292.21-315.824 382.842-511.978 679.418-207.522-298.424-512.022-377.572-512.022-679.418 0-148.392 120.426-268.832 268.808-268.832 60.354 0 115.99 27.53 160.796 67.834l-77.604 124.166 224 128-128 320 352-384-224-128 61.896-92.846c35.42-21.768 75.21-35.154 117.292-35.154z"></path>
                  </svg>
                  <div className="home1-container21">
                    <span>
                      <span>0</span>
                      <br></br>
                    </span>
                  </div>
                  <svg viewBox="0 0 1024 1024" className="home1-icon24">
                    <path d="M810 298h86v256h-648l154 154-60 60-256-256 256-256 60 60-154 154h562v-172z"></path>
                  </svg>
                  <div className="home1-container22">
                    <span>0</span>
                  </div>
                </div>
              </div>
              <div className="home1-container23">
                <div className="home1-container24">
                  <img
                    alt="image"
                    src="/uqaqhuvavt0-200h.jpg"
                    className="home1-image3"
                  />
                  <span className="home1-text24">3100BigFan</span>
                  <span className="home1-date-time1">
                    <DateTimePrimitive
                      format="h:mm DD/MM/YYYY"
                      date="Fri Mar 25 2024 12:30:01 GMT+0800 (中国标准时间)"
                    ></DateTimePrimitive>
                  </span>
                </div>
                <div className="home1-container25">
                  <span className="home1-text25">
                    <span>Love to write codes very much!</span>
                    <br></br>
                    <span className="home1-text28"># CSCI</span>
                    <br></br>
                  </span>
                </div>
                <div className="home1-container26">
                  <svg viewBox="0 0 1024 1024" className="home1-icon26">
                    <path d="M768 342v-86h-512v86h512zM768 470v-86h-512v86h512zM768 598v-86h-512v86h512zM854 86q34 0 59 25t25 59v512q0 34-25 60t-59 26h-598l-170 170v-768q0-34 25-59t59-25h684z"></path>
                  </svg>
                  <AppComponent></AppComponent>
                  <svg viewBox="0 0 1024 1024" className="home1-icon28">
                    <path d="M950.857 340.571c0-160.571-108.571-194.286-200-194.286-85.143 0-181.143 92-210.857 127.429-13.714 16.571-42.286 16.571-56 0-29.714-35.429-125.714-127.429-210.857-127.429-91.429 0-200 33.714-200 194.286 0 104.571 105.714 201.714 106.857 202.857l332 320 331.429-319.429c1.714-1.714 107.429-98.857 107.429-203.429zM1024 340.571c0 137.143-125.714 252-130.857 257.143l-356 342.857c-6.857 6.857-16 10.286-25.143 10.286s-18.286-3.429-25.143-10.286l-356.571-344c-4.571-4-130.286-118.857-130.286-256 0-167.429 102.286-267.429 273.143-267.429 100 0 193.714 78.857 238.857 123.429 45.143-44.571 138.857-123.429 238.857-123.429 170.857 0 273.143 100 273.143 267.429z"></path>
                  </svg>
                  <div className="home1-container27">
                    <span>
                      <span>10</span>
                      <br></br>
                    </span>
                  </div>
                  <svg viewBox="0 0 1024 1024" className="home1-icon30">
                    <path d="M755.188 64c148.382 0 268.812 120.44 268.812 268.832 0 292.21-315.824 382.842-511.978 679.418-207.522-298.424-512.022-377.572-512.022-679.418 0-148.392 120.426-268.832 268.808-268.832 60.354 0 115.99 27.53 160.796 67.834l-77.604 124.166 224 128-128 320 352-384-224-128 61.896-92.846c35.42-21.768 75.21-35.154 117.292-35.154z"></path>
                  </svg>
                  <div className="home1-container28">
                    <span>
                      <span>0</span>
                      <br></br>
                    </span>
                  </div>
                  <svg viewBox="0 0 1024 1024" className="home1-icon32">
                    <path d="M810 298h86v256h-648l154 154-60 60-256-256 256-256 60 60-154 154h562v-172z"></path>
                  </svg>
                  <div className="home1-container29">
                    <span>0</span>
                  </div>
                </div>
              </div>
              <Post
                text1="Test dislike."
                likes1="1"
                rootClassName="post-root-class-name5"
              ></Post>
              <Post rootClassName="post-root-class-name2"></Post>
            </div>
          </div>
        </div>
        <RightSidebar rootClassName="right-sidebar-root-class-name3"></RightSidebar>
      </div>
      <div className="home1-features"></div>
      <div className="home1-banner"></div>
      <div className="home1-faq"></div>
      <div className="home1-pricing"></div>
      <Footer rootClassName="footer-root-class-name1"></Footer>
      <div className="home1-footer"></div>
      <div className="home1-faq-container faqContainer"></div>
    </div>
  )
}

export default Home1
