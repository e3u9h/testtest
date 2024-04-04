import * as React from 'react';
import { useState,} from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, NavLink } from 'react-router-dom';
import { getLoginInfo, } from './Login';
import Login from './Login';
import Main from './Main';
import TweetDetail from './TweetDetail';
import { Notification } from './Notification';
import Search from './Search'
import { Admin } from './Admin';
import ProfileWrapper from './Profile';

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./css/App.css"
import { Followings } from './Followings';
import { Followers } from './Followers';



export const BACK_END = 'http://localhost:8000/'




function App() {
  const [isLogin, setLogin] = useState(getLoginInfo() ? getLoginInfo()['username'] : false);
  const [mode, setMode] = useState(getLoginInfo() ? getLoginInfo()['mode'] : false);
  const [userPortraitSrc, setUserPortraitSrc] = useState(null);

  const switchLoginState = () => {

  };


  return (
    <>
      <main className="container-fluid">
        <BrowserRouter>
          <div className="row" style={{ height: "100vh" }}>
            <div className="col-md-10 p-3 bg-light overflow-auto">
              <Routes>
                  <Route path='/' element={<Main />} />
                  <Route path='/login' element={<Login onChangeLogin={switchLoginState} />} />
                  <Route path='/search' element={<Search />} />
                  <Route path="/:username" element={<ProfileWrapper />} />
                  <Route path='/:username/followings' element={<Followings />} />
                  <Route path='/:username/followers' element={<Followers />} />
                  <Route path='/tweet/:tweetid' element={<TweetDetail />} />
                  <Route path='/admin' element={<Admin />} />
                  <Route path='/notification' element={<Notification ></Notification>} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>

      </main>

    </>
  );
}

export default App;
