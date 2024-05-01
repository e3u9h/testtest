import * as React from 'react';
import { createBrowserRouter, RouterProvider, BrowserRouter, Routes, Route, Navigate, Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './provider/context';
import Login from './Login';
import Main from './Main';
import TweetDetail from './TweetDetail';
import { Notification } from './Notification';
import Search from './Search'
import { Admin } from './Admin';
import Profile from './Profile';

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
import SearchTweetByKeyword from './SearchTweetByKeyword';
import Messenger from './Messenger';


export const BACK_END = 'http://localhost:8000/'


function App() {

  function AuthRoute({ children, requiredMode }) {
    const { username, mode } = useAuth();
    if (!username || (requiredMode !== undefined && mode !== requiredMode)) {
      console.log("111AuthRoute: ", username, children);
      localStorage.removeItem('userInfo');
      return <Navigate to="/login" replace />;
    } else {
      console.log("222AuthRoute: ", username, children);
      return children;
    }
  }


  const Layout = () => {
    return (<>
      <Header />
      <div className="row" style={{ height: "100vh" }}>
        <Navbar />
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
          <Navbar />
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
        { path: '/search', element: <Search /> },
        { path: '/notification', element: <Notification /> },
        { path: '/:username', element: <Profile /> },
        { path: '/:username/followings', element: <Followings /> },
        { path: '/:username/followers', element: <Followers /> },
        { path: '/messenger', element: <Messenger /> },
        { path: '/tweet/:tweetid', element: <TweetDetail /> },
        { path: '/searchuser/:username', element: <SearchUser /> },
        { path: '/searchtag/:tag', element: <SearchTweet /> },
        { path: '/searchtweet/:keyword', element: <SearchTweetByKeyword /> },
        { path: '/searchuserbyid/:id', element: <SearchUserid /> }
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

