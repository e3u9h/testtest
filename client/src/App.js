import * as React from 'react';
import { useState, } from 'react';
import { createBrowserRouter, RouterProvider, BrowserRouter, Routes, Route, Navigate, Outlet, NavLink, useNavigate } from 'react-router-dom';
import { getLoginInfo } from './Login';
import Login from './Login';
import Main from './Main';
import TweetDetail from './TweetDetail';
import { Notification } from './Notification';
import Search from './Search'
import { Admin } from './Admin';
import ProfileWrapper from './Profile';
import cookie from 'react-cookies';

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./css/App.css"
import { Followings } from './Followings';
import { Followers } from './Followers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faHome, faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import { remove } from 'react-cookies';



export const BACK_END = 'http://localhost:8000/'


function App() {
  const [userPortraitSrc, setUserPortraitSrc] = useState(null);

  function AuthRoute({ children, requiredMode }) {
    const userInfo = getLoginInfo();
    if (userInfo === undefined || userInfo['mode'] !== requiredMode) {
      return <Navigate to="/login" replace />;
    } else {
      console.log("AuthRoute: ", userInfo, children);
      return children;
    }
  }
  function Navbar({ mode }) {
    const navigate = useNavigate();
    const logout = () => {
      console.log("Remove Login Cookie");
      cookie.remove('userInfo');
      navigate('/login');
    };
    return (<>
      {<div className="col-md-2 p-3 text-bg-light">
        <div className="d-flex justify-content-center text-center">
          <img className="w-75 d-flex justify-content-center" src={[require('./img/c3ulogo.jpg')]} alt='logo.png'></img>
        </div>
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

  const Layout = () => {
    return (
      <div className="row" style={{ height: "100vh" }}>
        <Navbar mode="user" />
        <div className="col-md-10 p-3 bg-light overflow-auto">
          <Outlet />
        </div>
      </div>
    );
  }

  const LayoutAdmin = () => {
    return (
      <div className="row" style={{ height: "100vh" }}>
        <Navbar mode="admin" />
        <div className="col-md-10 p-3 bg-light overflow-auto">
          <Outlet />
        </div>
      </div>
    );
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: <AuthRoute requiredMode='user' ><Layout /></AuthRoute>,
      children: [
        { path: '', element: <Main /> },
        { path: 'search', element: <Search /> },
        { path: 'notification', element: <Notification /> },
        { path: ':username', element: <ProfileWrapper /> },
        { path: ':username/followings', element: <Followings /> },
        { path: ':username/followers', element: <Followers /> },
        { path: 'tweet/:tweetid', element: <TweetDetail /> },
      ]
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/admin',
      element: <AuthRoute requiredMode='admin'><LayoutAdmin /></AuthRoute>,
      children: [
        { index: true, element: <Admin /> }
      ]
    },
  ]);

  return (
    <>
      <main className="container-fluid">
        <RouterProvider router={router} />

      </main>

    </>
  );
}

export default App;
