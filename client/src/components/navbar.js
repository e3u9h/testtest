import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faHome, faSearch, faUser, faComment } from '@fortawesome/free-solid-svg-icons';
import { BACK_END } from '../App';
import './navbar.css';
import { useAuth } from '../provider/context';
import request from '../utils/request';

function Navbar() {
    const { logout, username, mode } = useAuth();
    const [userPortraitSrc, setUserPortraitSrc] = useState(null);
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    const changePwd = () => {
        const changepwdusername = username;
        const oldpwd = document.querySelector("#originalpwd").value;
        const newpwd = document.querySelector("#changedpwd").value;
        const newpwd2 = document.querySelector("#changedpwd2").value;
        const userinfo = {
            username: changepwdusername,
            oldpwd: oldpwd,
            newpwd: newpwd,
            newpwd2: newpwd2
        };
        // console.log(userinfo)
        if (userinfo['newpwd'] === '') {
            window.alert("Please enter a valid new password.");
        } else if (userinfo['newpwd'] !== '' && (userinfo['newpwd'].length <= 4 || userinfo['newpwd'].length >= 20)) {
            window.alert("The length of the new password should be >4 and <20.");
        } else if (newpwd !== newpwd2) {
            window.alert("Password mismatch!");
        } else {
            request.put("changepwd", userinfo)
                .then(res => {
                    if (res.status === 200) {
                    }
                    return res.data;
                })
                .then(data => { alert(data); })
                .catch(err => {
                    console.log(err);
                });
        }
    }

    useEffect(() => {
        console.log(BACK_END + "profile/portrait/" + username);
        request.get("profile/portrait/" + username)
            .then(res => {
                console.log(res);
                if (res.status !== 200) {
                    throw new Error('Network response was not ok');
                }
                return res.data;
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
                    {mode === 'user' && <NavLink to="/" className="nav-link text-muted" activeclassname="active">
                        <span><FontAwesomeIcon icon={faHome} className='me-2' />Home</span>
                    </NavLink>}
                </li>
                <li>
                    {mode === 'user' && <NavLink to="/search" className="nav-link text-muted" activeclassname="active">
                        <span><FontAwesomeIcon icon={faSearch} className='me-2' />Search</span>
                    </NavLink>}
                </li>
                <li>
                    {mode === 'user' && <NavLink to="/notification" className="nav-link text-muted" activeclassname="active">
                        <span><FontAwesomeIcon icon={faBell} className='me-2' />Notification</span>
                    </NavLink>}
                </li>
                <li>
                    {mode === 'user' && <NavLink to="/messenger" className="nav-link text-muted" activeclassname="active">
                        <span><FontAwesomeIcon icon={faComment} className='me-2' />Private Chat</span>
                    </NavLink>}
                </li>
                <li>
                    {mode === 'user' && <NavLink to={"/" + username} className="nav-link text-muted" activeclassname="active">
                        <span><FontAwesomeIcon icon={faUser} className='me-2' />Profile</span>
                    </NavLink>}
                </li>
                <li>
                    {mode === 'admin' && <NavLink to={"/admin"} className="nav-link text-muted" activeclassname="active">
                        <span><FontAwesomeIcon icon={faUser} className='me-2' />Admin Actions</span>
                    </NavLink>}
                </li>
            </ul>
            {<div className="dropdown">
                <hr />
                <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
                    data-bs-toggle="dropdown" aria-expanded="false">
                    {userPortraitSrc && mode === 'user' && <img src={BACK_END + userPortraitSrc} alt="" width="32" height="32" className="rounded-circle" style={{ objectFit: 'cover' }} />}
                    <strong className='ms-2 text-muted'>{username}</strong>
                </a>
                <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
                    <li><a className="dropdown-item" onClick={handleLogout}>Sign out</a></li>
                    <li><a type="button" className="dropdown-item" data-bs-toggle="modal" data-bs-target="#changepasswordForm" data-bs-whatever="@mdo" >Change Password</a></li>
                </ul>
            </div>}
        </div>}
        <div className="modal fade" id="changepasswordForm" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label htmlFor="name" className="col-form-label"> Old Password: </label>
                            <input type="password" className="form-control" id="originalpwd" />
                            <label htmlFor="name" className="col-form-label"> New Password: </label>
                            <input type="password" className="form-control" id="changedpwd" />
                            <label htmlFor="name" className="col-form-label"> Recheck New Password: </label>
                            <input type="password" className="form-control" id="changedpwd2" />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"> Cancel </button>
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={changePwd}> Submit </button>
                    </div>
                </div>
            </div>
        </div></>
    )
}

export default Navbar;