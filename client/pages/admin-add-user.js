import React from 'react'

import { Helmet } from 'react-helmet'

import Header from '../components/header'
import Footer from '../components/footer'
import './admin-add-user.css'

const AdminAddUser = (props) => {
  return (
    <div className="admin-add-user-container">
      <Helmet>
        <title>AdminAddUser - Downright Previous Termite</title>
        <meta
          property="og:title"
          content="AdminAddUser - Downright Previous Termite"
        />
      </Helmet>
      <div ww className="admin-add-user-container1">
        <Header></Header>
        <div className="admin-add-user-hero">
          <div className="admin-add-user-container2">
            <div className="admin-add-user-sidebar">
              <nav className="admin-add-user-nav">
                <h1 className="admin-add-user-text">
                  <span>Admin Add User</span>
                  <br></br>
                  <br></br>
                </h1>
                <span className="admin-add-user-text04">Nickname:</span>
                <button type="button" className="admin-add-user-button button">
                                   
                </button>
                <span className="admin-add-user-text05">Password:</span>
                <button type="button" className="admin-add-user-button1 button">
                                   
                </button>
                <span className="admin-add-user-text06">RecheckPassword:</span>
                <button type="button" className="admin-add-user-button2 button">
                                   
                </button>
                <span className="admin-add-user-text07">Age:</span>
                <button type="button" className="admin-add-user-button3 button">
                                   
                </button>
                <span className="admin-add-user-text08">Gender:</span>
                <select className="admin-add-user-gender">
                  <option value="Option 1">Option 1</option>
                  <option value="male">male</option>
                  <option value="female">female</option>
                  <option value="Option 2">Option 2</option>
                  <option value="Option 3">Option 3</option>
                  <option value="others">others</option>
                </select>
                <span className="admin-add-user-text09">Email:</span>
                <button type="button" className="admin-add-user-button4 button">
                                   
                </button>
                <button type="button" className="admin-add-user-button5 button">
                  <span>
                    <span>Add</span>
                    <br></br>
                  </span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
      <div className="admin-add-user-features"></div>
      <div className="admin-add-user-pricing"></div>
      <div className="admin-add-user-banner"></div>
    </div>
  )
}

export default AdminAddUser
