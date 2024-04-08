import React from 'react'
import Logo from "../img/logo.jpg"
import { Link } from 'react-router-dom'
import "./header.scss"
const Header = () => {
  return (
    <div className='header'>
      <div className='container'>
        <div className='logo'>
          <img src={Logo} alt="" />
        </div>
        <div className="links">
          <Link className='link' to="/login"><h6>cubeCU</h6></Link> 
        </div>
      </div>
    </div>
  )
}

export default Header
