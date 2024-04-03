import React from 'react'
import ReactDOM from 'react-dom'
import {
  
  Route,
  Routes,
  Navigate,
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
    
    <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/post11" element={<Post11 />} />
    <Route path="/search" element={<Search />} />
    <Route path="/profileanotheruser" element={<Profileanotheruser />} />
    <Route path="/friendlist" element={<Friendlist />} />
    <Route path="/loginafterregister" element={<Loginafterregister />} />
    <Route path="/manage-user" element={<ManageUser />} />
    <Route path="/admin-manage-post" element={<AdminManagePost />} />
    <Route path="/searchhottest" element={<Searchhottest />} />
    <Route path="/fblacklist1" element={<Fblacklist1 />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/login" element={<Login />} />
    <Route path="/follower-page" element={<FollowerPage />} />
    <Route path="/admin-manage-user" element={<AdminManageUser />} />
    <Route path="/register111" element={<Editprofile />} />
    <Route path="/searchuser" element={<Searchuser />} />
    <Route path="/" element={<Home1 />} />
    <Route path="/chatroom" element={<Chatroom />} />
    <Route path="/register11" element={<AdminAddUser />} />
    <Route path="/page1" element={<Page1 />} />
    <Route path="/post1" element={<Post1 />} />
    <Route path="/createpost" element={<Createpost />} />
    <Route path="/registerwithemailverification" element={<Registerwithemailverification />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
  )
}


export default App;
