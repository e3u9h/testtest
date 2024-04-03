import React from 'react'

import { Helmet } from 'react-helmet'

import Header from '../components/header'
import Footer from '../components/footer'
import './editprofile.css'

const Editprofile = (props) => {
  return (
    <div className="editprofile-container">
      <Helmet>
        <title>editprofile - Downright Previous Termite</title>
        <meta
          property="og:title"
          content="editprofile - Downright Previous Termite"
        />
      </Helmet>
      <div ww className="editprofile-container1">
        <Header></Header>
        <div className="editprofile-hero">
          <div className="editprofile-container2">
            <div className="editprofile-sidebar">
              <nav className="editprofile-nav">
                <h1 className="editprofile-text">
                  <span>Edit Profile</span>
                  <br></br>
                </h1>
                <span className="editprofile-text03">bio:</span>
                <textarea
                  name="bio"
                  placeholder="Write a short introduction of yourself."
                  autoComplete="Hello! I am a student taking CSCI3100."
                  className="editprofile-textarea textarea"
                ></textarea>
                <span className="editprofile-text04">Nickname:</span>
                <input
                  type="text"
                  name="nickname"
                  value="GroupA1 Student"
                  placeholder="GroupA1 Student"
                  className="editprofile-textinput input"
                />
                <span className="editprofile-text05">
                  <span>Location</span>
                  <br></br>
                </span>
                <input
                  type="text"
                  name="location"
                  value="CUHK"
                  placeholder="CUHK"
                  className="editprofile-textinput1 input"
                />
                <span className="editprofile-text08">Age:</span>
                <input
                  type="number"
                  name="age"
                  value="21"
                  placeholder="21"
                  className="editprofile-textinput2 input"
                />
                <span className="editprofile-text09">Gender:</span>
                <select className="editprofile-gender">
                  <option value="male">male</option>
                  <option value="female">female</option>
                  <option value="others">others</option>
                </select>
                <span className="editprofile-text10">
                  <span>Profile Picture:</span>
                  <br></br>
                </span>
                <img
                  alt="image"
                  src="https://play.teleporthq.io/static/svg/default-img.svg"
                  className="editprofile-image"
                />
                <a
                  href="https://example.com"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="editprofile-link"
                >
                  <span>Upload</span>
                  <br></br>
                </a>
                <button type="button" className="editprofile-button button">
                  <span>
                    <span>Save</span>
                    <br></br>
                  </span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
      <div className="editprofile-features"></div>
      <div className="editprofile-pricing"></div>
      <div className="editprofile-banner"></div>
    </div>
  )
}

export default Editprofile
