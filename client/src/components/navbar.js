import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faHome, faSearch, faUser, faComment } from '@fortawesome/free-solid-svg-icons';
import { BACK_END } from '../config';
import './navbar.css';
import { useAuth } from '../provider/context';
import request from '../utils/request';

// This is the navigating bar on the left side of the page
function Navbar() {
    const { logout, username, mode } = useAuth();
    const [userPortraitSrc, setUserPortraitSrc] = useState(null);
    const [editOldPassword, setEditOldPassword] = useState('');
    const [editNewPassword, setEditNewPassword] = useState('');
    const [editNewPassword2, setEditNewPassword2] = useState('');
    const navigate = useNavigate();
    const handleLogout = () => {
        // call the logout function from the context and redirect to the login page
        logout();
        navigate('/login');
    };
    const changePwd = () => {
        const changepwdusername = username;
        // create a userinfo object from the input
        const userinfo = {
            username: changepwdusername,
            oldpwd: editOldPassword,
            newpwd: editNewPassword,
            newpwd2: editNewPassword2
        };
        // console.log(userinfo)
        // check the format of the new password and whether the 2 new passwords are the same
        if (userinfo['newpwd'] === '') {
            window.alert("Please enter a new password.");
        } else if (userinfo['newpwd'] !== '' && (userinfo['newpwd'].length <= 4 || userinfo['newpwd'].length >= 20)) {
            window.alert("The length of the new password should be larger than 4 and smaller than 20.");
        } else if (userinfo['newpwd'] !== userinfo['newpwd2']) {
            window.alert("Password mismatch!");
        } else {
            // if the format is correct, send the request to the backend
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
        // fetch the user portrait from the backend when first rendering
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
            <hr />
            {/* the links to different pages */}
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
                {/* the only link shown if the mode is admin */}
                <li>
                    {mode === 'admin' && <NavLink to={"/admin"} className="nav-link text-muted" activeclassname="active">
                        <span><FontAwesomeIcon icon={faUser} className='me-2' />Admin Actions</span>
                    </NavLink>}
                </li>
            </ul>
            {/* the user information and the dropdown menu for logout and change password */}
            {<div className="dropdown">
                <hr />
                <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
                    data-bs-toggle="dropdown" aria-expanded="false">
                    {userPortraitSrc && mode === 'user' && <img src={BACK_END + userPortraitSrc} alt="" width="32" height="32" className="rounded-circle" style={{ objectFit: 'cover' }} />}
                    <strong className='ms-2 text-muted'>{username}</strong>
                </a>
                <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
                    <li><a className="dropdown-item" onClick={handleLogout}>Logout</a></li>
                    <li><a type="button" className="dropdown-item" data-bs-toggle="modal" data-bs-target="#changepasswordForm" data-bs-whatever="@mdo" >Change Password</a></li>
                </ul>
            </div>}
        </div>}
        {/* the modal for password changing */}
        <div className="modal fade" id="changepasswordForm" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label htmlFor="name" className="col-form-label"> Old Password: </label>
                            <input type="password" className="form-control" value={editOldPassword} onChange={(e) => setEditOldPassword(e.target.value)} />
                            <label htmlFor="name" className="col-form-label"> New Password: </label>
                            <input type="password" className="form-control" value={editNewPassword} onChange={(e) => setEditNewPassword(e.target.value)} />
                            <label htmlFor="name" className="col-form-label"> Recheck New Password: </label>
                            <input type="password" className="form-control" value={editNewPassword2} onChange={(e) => setEditNewPassword2(e.target.value)} />
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