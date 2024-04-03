import React, {useState} from 'react'

import { Helmet } from 'react-helmet'

import Header from '../components/header'
import Footer from '../components/footer'
import './registerwithemailverification.css'
import  { useNavigate } from 'react-router-dom'

const Registerwithemailverification = (props) => {
    const navigate = useNavigate()
    const [nickname, setNickname] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [age, setAge] = useState("")
    const [gender, setGender] = useState("male")
    const [email, setEmail] = useState("")
    const handleRegister = (event) =>{
        event.preventDefault()
        const emailformat = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if(nickname===""){
            window.alert("Please input nickname.")
        }
        else if(password.length < 8){
            window.alert("Password whould be longer than 8 characters.")
        }
        else if(password!==password2){
            window.alert("Password mismatch!")
        }
        else if(age<0){
            window.alert("Age cannot be nagetive!")
        }
        else if(!emailformat.test(email)){
            window.alert("Invalid email format!")
        }
        else{
            fetch('http//:localhost:3000/api/register', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nickname, password, age, gender, email }),
              })
              .then(response => response.json())
              .then(data => {
                if (data.token) {
                  localStorage.setItem('token', data.token);
                  console.log('register success');
                  navigate('/home1', { replace: true })
                } else {
                  console.log('register failed:', data.message);
                }
              })
              .catch(error => {
                console.error('register error', error);
              })
        }
    }

  return (
    <div className="registerwithemailverification-container">
      <Helmet>
        <title>
          Registerwithemailverification - Downright Previous Termite
        </title>
        <meta
          property="og:title"
          content="Registerwithemailverification - Downright Previous Termite"
        />
      </Helmet>
      <div ww className="registerwithemailverification-container1">
        <Header></Header>
        <div className="registerwithemailverification-hero">
          <div className="registerwithemailverification-container2">
            <div className="registerwithemailverification-sidebar">
              <nav className="registerwithemailverification-nav">
                <img
                  alt="image"
                  src="/external/wechatimg148-200h.jpg"
                  className="registerwithemailverification-image"
                />
                <form onSubmit={handleRegister}>
                <block className="registerwithemailverification-text">
                  Nickname:
                </block>
                <input
                  type="text"
                  required="true"
                  className="registerwithemailverification-textinput input"
                  onChange = {(e) => setNickname(e.target.value)}
                />
                <span className="registerwithemailverification-text1">
                  Password:
                </span>
                <input
                  type="password"
                  required="true"
                  className="registerwithemailverification-textinput1 input"
                  onChange = {(e) => setPassword(e.target.value)}
                />
                <span className="registerwithemailverification-text2">
                  RecheckPassword:
                </span>
                <input
                  type="password"
                  required="true"
                  className="registerwithemailverification-textinput2 input"
                  onChange = {(e) => setPassword2(e.target.value)}
                />
                <span className="registerwithemailverification-text3">
                  Age:
                </span>
                <input
                  type="number"
                  required="true"
                  className="registerwithemailverification-textinput3 input"
                  onChange = {(e) => setAge(e.target.value)}
                />
                <span className="registerwithemailverification-text4">
                  Gender:
                </span>
                <select className="registerwithemailverification-gender" value={gender} onChange = {(e) => setGender(e.target.value)}>
                  <option value="male">male</option>
                  <option value="female">female</option>
                  <option value="others">others</option>
                </select>
                <span className="registerwithemailverification-text5">
                  Email:
                </span>
                <div className="registerwithemailverification-container3">
                  <input
                    type="email"
                    required="true"
                    className="registerwithemailverification-textinput4 input"
                    onChange = {(e) => setEmail(e.target.value)}
                  />
                  <button
                    type="button"
                    className="registerwithemailverification-button button"
                  >
                    get verification code
                  </button>
                </div>
                <span className="registerwithemailverification-text6">
                  Verification code:
                </span>
                <input
                  type="text"
                  className="registerwithemailverification-textinput5 input"
                />
                <button
                  type="submit"
                  className="registerwithemailverification-button1 button"
                >
                  Register
                </button>
                </form>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
      <div className="registerwithemailverification-features"></div>
      <div className="registerwithemailverification-pricing"></div>
      <div className="registerwithemailverification-banner"></div>
    </div>
  )
}

export default Registerwithemailverification
