import cookie from 'react-cookies';
import React, { useState } from 'react';
import {
  MDBContainer,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane
}
  from 'mdb-react-ui-kit';
import { Navigate } from 'react-router-dom';
import { BACK_END } from './App';

export const getLoginInfo = () => {
  return cookie.load('userInfo');
};

export const login = (username, mode) => {
  console.log("Save Login Cookie");
  cookie.save('userInfo', { username, mode }, { path: '/', maxAge: 3600 });
};

export const logout = () => {
  console.log("Remove Login Cookie");
  cookie.remove('userInfo');
};


const Login = (props) => {
  const [login, setLogin] = useState(false);
  const [mode, setMode] = useState('user');
  const [justifyActive, setJustifyActive] = useState('login');

  const handleRegister = (event) => {
    event.preventDefault();
    const username = document.getElementById("newusername").value;
    const newpwd = document.getElementById("newpwd").value;
    const newpwd2 = document.getElementById("newpwd2").value;
    const genderRadios = document.getElementsByName("radio-gender");
    const genderRadio = document.querySelector('input[name="radio-gender"]:checked');
    const gender = genderRadio ? genderRadio.value : null;
    console.log(username,newpwd,gender)
    const userInfo = {
      newusername: username,
      newpwd: newpwd,
      gender: gender
    };
    if (username==='') {
      window.alert("Please enter a username.");
    } else if (!newpwd || !newpwd2) {
      window.alert("Please enter a password");
    } else if (newpwd.length <= 4 || newpwd.length >= 20) {
      window.alert("The length of the password should be larger than 4 and smaller than 20.");
    } else if (newpwd !== newpwd2) {
      window.alert("Password mismatch!");
    } else if (!gender) {
        window.alert("Please select a gender.");
    } else {
    fetch(BACK_END + "createuser", {
        method: "POST",
        body: JSON.stringify(userInfo),
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then(res => {
        if (res.status === 201) {
          setLogin(true);
          setUsername(username);
          setMode('user');
          login(username, 'user');
        }
        return res.text();
      })
      .then(data => { alert(data); })
      .catch(err => {
        console.log(err);
      });
    }
  }

  const handleJustifyClick = (value) => {
    if (value === justifyActive) {
      return;
    }
    setJustifyActive(value);
  };

  const handleUserSubmit = (event) => {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const pwd = document.getElementById("pwd").value;
    const userInfo = {
      username: username,
      pwd: pwd
    };
    
    fetch(BACK_END + "login/user", {
      method: "POST",
      body: JSON.stringify(userInfo),
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(res => {
        if (res.status === 201) {
          setLogin(true);
          setUsername(username);
          setMode('user');
          login(username, 'user');
        }
        return res.text();
      })
      .then(data => {
        if (data == 'Login As Admin Successfully!\n') {
          setLogin(true);
          setUsername(username);
          setMode('admin');
          login(username, 'admin');
        } alert(data)
      })
      .catch(err => {
        console.log(err);
      });
  };
    return (login === false ? 
      (<MDBContainer  className="p-3 my-5 d-flex flex-column w-50">

        <MDBTabs pills justify className='mb-3 d-flex flex-row justify-content-between'>
          <MDBTabsItem>
            <MDBTabsLink 
              onClick={() => handleJustifyClick('login')} 
              active={justifyActive === 'login'} 
              color={justifyActive === 'login' ? "secondary" : "light"}
              className={justifyActive === 'login' ? "text-white" : "text-secondary"}
            >
              Login
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <MDBTabsLink 
              onClick={() => handleJustifyClick('register')} 
              active={justifyActive === 'register'} 
              color={justifyActive === 'register' ? "secondary" : "light"}
              className={justifyActive === 'register' ? "text-white" : "text-secondary"}
            >
              Register
            </MDBTabsLink>
          </MDBTabsItem>
        </MDBTabs>

        <MDBTabsContent>
            
          <MDBTabsPane show={justifyActive === 'login'}>

            <div className="form-group mb-4">
                <label htmlFor="newusername">Username</label>
                <input type="text" className="form-control" id="username" />
            </div>
            <div className="form-group mb-4">
                <label htmlFor="newpwd">Password</label>
                <input type="password" className="form-control" id="pwd" />
            </div>
            <button 
                className="mb-4 w-100" 
                style={{ 
                    backgroundColor: "#6c757d", 
                    color: "white", 
                    fontSize: "17px", 
                    borderRadius: "4px", 
                    border: "white",
                    height: "40px" 
                }} 
                onClick={handleUserSubmit}
            >
                Login
            </button>
        </MDBTabsPane>
        <MDBTabsPane show={justifyActive === 'register'}>

        <div className="form-group mb-4">
            <label htmlFor="newusername">Username</label>
            <input type="text" className="form-control" id="newusername" />
        </div>
        <div className="form-group mb-4">
            <label htmlFor="newpwd">Password</label>
            <input type="password" className="form-control" id="newpwd" />
        </div>
        <div className="form-group mb-4">
            <label htmlFor="newpwd2">Recheck Password</label>
            <input type="password" className="form-control" id="newpwd2" />
        </div>
            <div className="mb-5">
                <label htmlFor="gender" className="col-form-label"> Gender: </label>
                <div className="d-flex">
                    <div className="form-check me-4">
                        <input className="form-check-input" type="radio" name="radio-gender" id="radio-male" value="Male" />
                        <label className="form-check-label" htmlFor="radio-male">
                        Male
                        </label>
                    </div>
                    <div className="form-check me-4">
                        <input className="form-check-input" type="radio" name="radio-gender" id="radio-female" value="Female" />
                        <label className="form-check-label" htmlFor="radio-female">
                        Female
                        </label>
                    </div>
                    <div className="form-check me-4">
                        <input className="form-check-input" type="radio" name="radio-gender" id="radio-others" value="Others" />
                        <label className="form-check-label" htmlFor="radio-others">
                        Others
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="radio-gender" id="radio-nottospecify" value="NottoSpecify" />
                        <label className="form-check-label" htmlFor="radio-nottospecify">
                        Not to Specify
                        </label>
                    </div>
                </div>
            </div>
            <button 
                className="mb-4 w-100" 
                style={{ 
                    backgroundColor: "#6c757d",
                    color: "white", 
                    fontSize: "17px", 
                    borderRadius: "4px", 
                    border: "white",
                    height: "40px"
                }} 
                onClick={handleRegister}
            >
                Register
            </button>

        </MDBTabsPane>

        </MDBTabsContent>

      </MDBContainer>) :(mode === 'user' ? <Navigate to='/'/> : <Navigate to='/admin'/>)
    );
}
export default Login;

