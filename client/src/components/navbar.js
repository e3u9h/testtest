import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getLoginInfo } from '../Login';
import cookie from 'react-cookies';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faHome, faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import { BACK_END } from '../App';
import './navbar.css';

function Navbar({ mode }) {
    const [userPortraitSrc, setUserPortraitSrc] = useState(null);
    const navigate = useNavigate();
    const logout = () => {
        console.log("Remove Login Cookie");
        cookie.remove('userInfo');
        navigate('/login');
    };
    useEffect(() => {
        const username = getLoginInfo()['username'];
        console.log(BACK_END + "portrait/" + username);
        fetch(BACK_END + "portrait/" + username)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.text();
            })
            .then(text => {
                console.log(text);
                let portrait = text;
                if (!portrait) {
                    portrait = "/img/defaultPortrait.jpg";
                }
                setUserPortraitSrc(portrait);
            })
            .catch(err => {
                console.error(err);
                setUserPortraitSrc("/img/defaultPortrait.jpg");
            });
    }, []);
    return (<>
        {<div className="col-md-2 p-3 text-bg-light">
            {/* <div className="d-flex justify-content-center text-center">
          <img className="w-75 d-flex justify-content-center" src={[require('./img/c3ulogo.jpg')]} alt='logo.png'></img>
        </div> */}
            <hr />
            <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item">
                    {mode == 'user' && <NavLink to="/" className="nav-link text-muted" activeclassname="active">
                        <span><FontAwesomeIcon icon={faHome} className='me-2' />Home</span>
                    </NavLink>}
                </li>
                <li>
                    {mode == 'user' && <NavLink to="/search" className="nav-link text-muted" activeclassname="active">
                        <span><FontAwesomeIcon icon={faSearch} className='me-2' />Search</span>
                    </NavLink>}
                </li>
                <li>
                    {mode == 'user' && <NavLink to="/notification" className="nav-link text-muted" activeclassname="active">
                        <span><FontAwesomeIcon icon={faBell} className='me-2' />Notification</span>
                    </NavLink>}
                </li>
                <li>
                    {mode == 'user' && <NavLink to={"/" + getLoginInfo()['username']} className="nav-link text-muted" activeclassname="active">
                        <span><FontAwesomeIcon icon={faUser} className='me-2' />Profile</span>
                    </NavLink>}
                </li>
                <li>
                    {mode == 'admin' && <NavLink to={"/admin"} className="nav-link text-muted" activeclassname="active">
                        <span><FontAwesomeIcon icon={faUser} className='me-2' />Admin Actions</span>
                    </NavLink>}
                </li>
            </ul>
            {<div className="dropdown">
                <hr />
                <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
                    data-bs-toggle="dropdown" aria-expanded="false">
                    {userPortraitSrc && <img src={BACK_END + userPortraitSrc} alt="" width="32" height="32" className="rounded-circle" />}
                    <strong className='ms-2 text-muted'>{getLoginInfo()['username']}</strong>
                </a>
                <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
                    <li><a className="dropdown-item" onClick={logout}>Sign out</a></li>
                    <li><a type="button" className="dropdown-item" data-bs-toggle="modal" data-bs-target="#changepasswordForm" data-bs-whatever="@mdo" >Change Password</a></li>
                </ul>
            </div>}
        </div>}</>
    )
}

export default Navbar;