import React from 'react'
import { Link } from 'react-router-dom'

import { Helmet } from 'react-helmet'

import NavigationLinks1 from '../components/navigation-links1'
import Component8 from '../components/component8'
import Footer from '../components/footer'
import './loginafterregister.css'

const Loginafterregister = (props) => {
  return (
    <div className="loginafterregister-container">
      <Helmet>
        <title>loginafterregister - Downright Previous Termite</title>
        <meta
          property="og:title"
          content="loginafterregister - Downright Previous Termite"
        />
      </Helmet>
      <div className="loginafterregister-header">
        <span className="logo">C3u</span>
        <div className="loginafterregister-container01">
          <div className="loginafterregister-container02"></div>
          <div
            data-thq="thq-navbar-nav"
            className="loginafterregister-desktop-menu"
          ></div>
        </div>
      </div>
      <header data-role="Header" className="loginafterregister-header1">
        <div className="loginafterregister-nav">
          <NavigationLinks1 rootClassName="rootClassName8"></NavigationLinks1>
        </div>
        <div className="loginafterregister-btn-group">
          <button className="loginafterregister-login button">Login</button>
          <button className="button">Register</button>
        </div>
        <div data-role="BurgerMenu" className="loginafterregister-burger-menu">
          <svg viewBox="0 0 1024 1024" className="loginafterregister-icon">
            <path d="M128 554.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667zM128 298.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667zM128 810.667h768c23.552 0 42.667-19.115 42.667-42.667s-19.115-42.667-42.667-42.667h-768c-23.552 0-42.667 19.115-42.667 42.667s19.115 42.667 42.667 42.667z"></path>
          </svg>
        </div>
        <div data-role="MobileMenu" className="loginafterregister-mobile-menu">
          <div className="loginafterregister-nav1">
            <div className="loginafterregister-container03">
              <img
                alt="image"
                src="https://presentation-website-assets.teleporthq.io/logos/logo.png"
                className="loginafterregister-image"
              />
              <div
                data-role="CloseMobileMenu"
                className="loginafterregister-menu-close"
              >
                <svg
                  viewBox="0 0 1024 1024"
                  className="loginafterregister-icon02"
                >
                  <path d="M810 274l-238 238 238 238-60 60-238-238-238 238-60-60 238-238-238-238 60-60 238 238 238-238z"></path>
                </svg>
              </div>
            </div>
            <NavigationLinks1 rootClassName="rootClassName9"></NavigationLinks1>
          </div>
          <div>
            <svg
              viewBox="0 0 950.8571428571428 1024"
              className="loginafterregister-icon04"
            >
              <path d="M925.714 233.143c-25.143 36.571-56.571 69.143-92.571 95.429 0.571 8 0.571 16 0.571 24 0 244-185.714 525.143-525.143 525.143-104.571 0-201.714-30.286-283.429-82.857 14.857 1.714 29.143 2.286 44.571 2.286 86.286 0 165.714-29.143 229.143-78.857-81.143-1.714-149.143-54.857-172.571-128 11.429 1.714 22.857 2.857 34.857 2.857 16.571 0 33.143-2.286 48.571-6.286-84.571-17.143-148-91.429-148-181.143v-2.286c24.571 13.714 53.143 22.286 83.429 23.429-49.714-33.143-82.286-89.714-82.286-153.714 0-34.286 9.143-65.714 25.143-93.143 90.857 112 227.429 185.143 380.571 193.143-2.857-13.714-4.571-28-4.571-42.286 0-101.714 82.286-184.571 184.571-184.571 53.143 0 101.143 22.286 134.857 58.286 41.714-8 81.714-23.429 117.143-44.571-13.714 42.857-42.857 78.857-81.143 101.714 37.143-4 73.143-14.286 106.286-28.571z"></path>
            </svg>
            <svg
              viewBox="0 0 877.7142857142857 1024"
              className="loginafterregister-icon06"
            >
              <path d="M585.143 512c0-80.571-65.714-146.286-146.286-146.286s-146.286 65.714-146.286 146.286 65.714 146.286 146.286 146.286 146.286-65.714 146.286-146.286zM664 512c0 124.571-100.571 225.143-225.143 225.143s-225.143-100.571-225.143-225.143 100.571-225.143 225.143-225.143 225.143 100.571 225.143 225.143zM725.714 277.714c0 29.143-23.429 52.571-52.571 52.571s-52.571-23.429-52.571-52.571 23.429-52.571 52.571-52.571 52.571 23.429 52.571 52.571zM438.857 152c-64 0-201.143-5.143-258.857 17.714-20 8-34.857 17.714-50.286 33.143s-25.143 30.286-33.143 50.286c-22.857 57.714-17.714 194.857-17.714 258.857s-5.143 201.143 17.714 258.857c8 20 17.714 34.857 33.143 50.286s30.286 25.143 50.286 33.143c57.714 22.857 194.857 17.714 258.857 17.714s201.143 5.143 258.857-17.714c20-8 34.857-17.714 50.286-33.143s25.143-30.286 33.143-50.286c22.857-57.714 17.714-194.857 17.714-258.857s5.143-201.143-17.714-258.857c-8-20-17.714-34.857-33.143-50.286s-30.286-25.143-50.286-33.143c-57.714-22.857-194.857-17.714-258.857-17.714zM877.714 512c0 60.571 0.571 120.571-2.857 181.143-3.429 70.286-19.429 132.571-70.857 184s-113.714 67.429-184 70.857c-60.571 3.429-120.571 2.857-181.143 2.857s-120.571 0.571-181.143-2.857c-70.286-3.429-132.571-19.429-184-70.857s-67.429-113.714-70.857-184c-3.429-60.571-2.857-120.571-2.857-181.143s-0.571-120.571 2.857-181.143c3.429-70.286 19.429-132.571 70.857-184s113.714-67.429 184-70.857c60.571-3.429 120.571-2.857 181.143-2.857s120.571-0.571 181.143 2.857c70.286 3.429 132.571 19.429 184 70.857s67.429 113.714 70.857 184c3.429 60.571 2.857 120.571 2.857 181.143z"></path>
            </svg>
            <svg
              viewBox="0 0 602.2582857142856 1024"
              className="loginafterregister-icon08"
            >
              <path d="M548 6.857v150.857h-89.714c-70.286 0-83.429 33.714-83.429 82.286v108h167.429l-22.286 169.143h-145.143v433.714h-174.857v-433.714h-145.714v-169.143h145.714v-124.571c0-144.571 88.571-223.429 217.714-223.429 61.714 0 114.857 4.571 130.286 6.857z"></path>
            </svg>
          </div>
        </div>
      </header>
      <div className="loginafterregister-hero">
        <div className="loginafterregister-hero1 heroContainer">
          <div className="loginafterregister-container04">
            <span className="loginafterregister-hero-sub-heading bodyLarge">
              <span>
                <span>
                  <span>Connect with the world through your content</span>
                  <span>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: ' ',
                      }}
                    />
                  </span>
                </span>
                <span>
                  <span>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: ' ',
                      }}
                    />
                  </span>
                  <span>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: ' ',
                      }}
                    />
                  </span>
                </span>
              </span>
              <span>
                <span>
                  <span>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: ' ',
                      }}
                    />
                  </span>
                  <span>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: ' ',
                      }}
                    />
                  </span>
                </span>
                <span>
                  <span>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: ' ',
                      }}
                    />
                  </span>
                  <span>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: ' ',
                      }}
                    />
                  </span>
                </span>
              </span>
            </span>
          </div>
          <h1 className="loginafterregister-hero-heading heading1">
            Share Your Voice Online
          </h1>
          <div className="loginafterregister-container05">
            <img
              alt="image"
              src="/external/%C3%A5%C2%BE%C2%AE%C3%A4%C2%BF%C2%A1%C3%A5%C2%9B%C2%BE%C3%A7%C2%89%C2%87_20240323020804-300h.jpg"
              loading="eager"
              className="loginafterregister-image1"
            />
            <div className="loginafterregister-container06">
              <div className="loginafterregister-btn-group1"></div>
              <div className="loginafterregister-container07">
                <div className="loginafterregister-container08">
                  <div className="loginafterregister-container09">
                    <div className="loginafterregister-container10">
                      <div className="loginafterregister-container11">
                        <div className="loginafterregister-container12">
                          <div className="loginafterregister-container13"></div>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="loginafterregister-button button"
                    >
                      GroupA1Student
                    </button>
                    <button
                      type="button"
                      className="loginafterregister-button1 button"
                    >
                      Password
                    </button>
                    <div className="loginafterregister-container14">
                      <Component8></Component8>
                      <div className="loginafterregister-container15">
                        <button
                          type="button"
                          className="loginafterregister-button2 button"
                        >
                          Find it
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="loginafterregister-container16">
                  <div className="loginafterregister-container17">
                    <span className="loginafterregister-text14">
                      <br></br>
                      <span>Do not have account   </span>
                    </span>
                  </div>
                  <div className="loginafterregister-container18">
                    <Link
                      to="/register1"
                      className="loginafterregister-navlink button"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button type="button" className="loginafterregister-button3 button">
            Login
          </button>
        </div>
      </div>
      <span className="loginafterregister-text17">
        <span>You are an admin user?</span>
        <br></br>
        <span> </span>
      </span>
      <div className="loginafterregister-container19"></div>
      <button type="button" className="loginafterregister-button4 button">
        Login here
      </button>
      <Footer></Footer>
    </div>
  )
}

export default Loginafterregister
