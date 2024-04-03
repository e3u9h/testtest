import React from 'react'
import ReactDOM from 'react-dom'
import {
  
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'

import './style.css'
import Post11 from './pages/post11'
import Search from './pages/search'
import Profileanotheruser from './pages/profileanotheruser'
import Friendlist from './pages/friendlist'
import Loginafterregister from './pages/loginafterregister'
import ManageUser from './pages/manage-user'
import AdminManagePost from './pages/admin-manage-post'
import Searchhottest from './pages/searchhottest'
import Fblacklist1 from './pages/fblacklist1'
import Profile from './pages/profile'
import Login from './pages/login'
import FollowerPage from './pages/follower-page'
import AdminManageUser from './pages/admin-manage-user'
import Editprofile from './pages/editprofile'
import Searchuser from './pages/searchuser'
import Home1 from './pages/home1'
import Chatroom from './pages/chatroom'
import AdminAddUser from './pages/admin-add-user'
import Page1 from './pages/page1'
import Post1 from './pages/post1'
import Createpost from './pages/createpost'
import Registerwithemailverification from './pages/registerwithemailverification'
import NotFound from './pages/not-found'

// router的作用：给网址后面加上/login等等，这里是定义了哪个网址对应哪个component
// （一个页面就是一个component，大component（页面）在pages文件夹，小component在components文件夹）
// 要使用router，如点击哪个按钮就跳转到什么页面，问gpt"onClick"（好像还有一种是用this.props的，可以实现先干一些别的再跳转）
const App = () => {
  return (
    
      <Switch>
        <Route component={Post11} exact path="/post11" />
        <Route component={Search} exact path="/search" />
        <Route
          component={Profileanotheruser}
          exact
          path="/profileanotheruser"
        />
        <Route component={Friendlist} exact path="/friendlist" />
        <Route
          component={Loginafterregister}
          exact
          path="/loginafterregister"
        />
        <Route component={ManageUser} path="/manage-user" />
        <Route component={AdminManagePost} path="/admin-manage-post" />
        <Route component={Searchhottest} path="/searchhottest" />
        <Route component={Fblacklist1} path="/fblacklist1" />
        <Route component={Profile} exact path="/profile" />
        <Route component={Login} exact path="/login" />
        <Route component={FollowerPage} exact path="/follower-page" />
        <Route component={AdminManageUser} exact path="/admin-manage-user" />
        <Route component={Editprofile} exact path="/register111" />
        <Route component={Searchuser} exact path="/searchuser" />
        <Route component={Home1} exact path="/home1" />
        <Route component={Chatroom} exact path="/chatroom" />
        <Route component={AdminAddUser} exact path="/register11" />
        <Route component={Page1} exact path="/page1" />
        <Route component={Post1} exact path="/post1" />
        <Route component={Createpost} exact path="/createpost" />
        <Route
          component={Registerwithemailverification}
          exact
          path="/registerwithemailverification"
        />
        <Redirect to="/login" />
      </Switch>

  )
}


export default App;
