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

// use of existing code: I referred to some sample code in 【使用React、Node.js和MySQL构建博客应用程序-哔哩哔哩】 https://b23.tv/T4LPkm7 (P3: 03-React Router Dom 6.4 Tutorial) to learn how to use creathBrowserRouter;
// also, I referred to some sample code in 【黑马程序员前端React18入门到实战视频教程，从react+hooks核心基础到企业级项目开发实战（B站评论、极客园项目等）及大厂面试全通关-哔哩哔哩】 https://b23.tv/hqVNyZA (P97: Day7-02.根据Token控制路由跳转 and P99: Day7-04.Layout-二级路由配置)
// to learn how to set AuthRoute according to the login state
// and modified them (add the requiredMode parameter) to make them fit our project

// use of AI: I used GPT-4 in poe (https://poe.com/) to help me debug

function App() {

  function AuthRoute({ children, requiredMode }) {
    // this is a route for authentication which checks whether the user is logged in and has the required mode
    const { username, mode, logout } = useAuth();
    if (!username || (requiredMode !== undefined && mode !== requiredMode)) {
      console.log("111AuthRoute: ", username, children);
      // if the user is not logged in or does not have the required mode, logout and redirect to the login page
      logout();
      return <Navigate to="/login" replace />;
    } else {
      console.log("222AuthRoute: ", username, children);
      // if the user is logged in and has the required mode, return the children
      return children;
    }
  }


  const Layout = () => {
    // this is the layout of the all the pages except the login page,
    // which consists of a header, a navbar, and the main content
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

  // there are three kinds of routes: normal routes, login route, and admin route
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
      element: <AuthRoute requiredMode='admin'><Layout /></AuthRoute>,
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

