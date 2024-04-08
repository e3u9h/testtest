import * as React from 'react';
import { createBrowserRouter, RouterProvider, BrowserRouter, Routes, Route, Navigate, Outlet, NavLink, useNavigate } from 'react-router-dom';
import { getLoginInfo } from './Login';
import Login from './Login';
import Main from './Main';
import TweetDetail from './TweetDetail';
import { Notification } from './Notification';
import Search from './Search'
import { Admin } from './Admin';
import ProfileWrapper from './Profile';

import Header from './components/header';

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./css/App.css"
import { Followings } from './Followings';
import { Followers } from './Followers';
import Navbar from './components/navbar';
import SearchUser from './SearchUser';
import SearchTweet from './SearchTweet';
import SearchUserid from './Searchid';
import cookie from 'react-cookies';



export const BACK_END = 'http://localhost:8000/'


function App() {

  function AuthRoute({ children, requiredMode }) {
    const userInfo = getLoginInfo();
    if (userInfo === undefined || (requiredMode !== undefined && userInfo['mode'] !== requiredMode)) {
      cookie.remove('userInfo');
      return <Navigate to="/login" replace />;
    } else {
      console.log("AuthRoute: ", userInfo, children);
      return children;
    }
  }


  const Layout = () => {
    return (<>
      <Header />
      <div className="row" style={{ height: "100vh" }}>
        <Navbar mode="user" />
        <div className="col-md-10 p-3 bg-light overflow-auto">
          <Outlet />
        </div>
      </div>
    </>
    );
  }

  const LayoutAdmin = () => {
    return (
      <>
        <Header />
        <div className="row" style={{ height: "100vh" }}>
          <Navbar mode="admin" />
          <div className="col-md-10 p-3 bg-light overflow-auto">
            <Outlet />
          </div>
        </div>
      </>
    );
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: <AuthRoute ><Layout /></AuthRoute>,
      children: [
        { path: '', element: <Main /> },
        { path: 'search', element: <Search /> },
        { path: 'notification', element: <Notification /> },
        { path: ':username', element: <ProfileWrapper /> },
        { path: ':username/followings', element: <Followings /> },
        { path: ':username/followers', element: <Followers /> },
        { path: 'tweet/:tweetid', element: <TweetDetail /> },
        { path: 'searchuser/:username', element: <SearchUser /> },
        { path: 'searchtag/:tag', element: <SearchTweet /> },
        { path: 'searchuserbyid/:id', element: <SearchUserid /> }
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

