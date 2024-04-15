import cookie from 'react-cookies';
import React, { useEffect, useState } from 'react';
import {
  MDBContainer,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane
}
  from 'mdb-react-ui-kit';
import { useNavigate, Navigate } from 'react-router-dom';
import { BACK_END } from './App';
import Header from './components/header';
import Form from 'react-bootstrap/Form';
import { useAuth } from './provider/context';




const Login = (props) => {
  const { login, username, mode } = useAuth();
  const [loggedin, setLoggedin] = useState(username !== undefined);
  const [justifyActive, setJustifyActive] = useState('login');
  const [editgender, setEditgender] = useState('Not to Specify');
  const navigate = useNavigate();
  const handleGenderChange = (event) => {
    setEditgender(event.target.value);
  };
  const handleRegister = (event) => {
    event.preventDefault();
    const username = document.getElementById("newusername").value;
    const newpwd = document.getElementById("newpwd").value;
    const newpwd2 = document.getElementById("newpwd2").value;
    console.log(username, newpwd)
    const userInfo = {
      newusername: username,
      newpwd: newpwd,
      gender: editgender
    };
    if (username === '') {
      window.alert("Please enter a username.");
    } else if (!newpwd || !newpwd2) {
      window.alert("Please enter a password");
    } else if (newpwd.length <= 4 || newpwd.length >= 20) {
      window.alert("The length of the password should be larger than 4 and smaller than 20.");
    } else if (newpwd !== newpwd2) {
      window.alert("Password mismatch!");
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
            setLoggedin(true);
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
    const username1 = document.getElementById("username").value;
    const pwd = document.getElementById("pwd").value;
    const userInfo = {
      username: username1,
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
        console.log(res);
        if (res.status === 201) {
          setLoggedin(true);
          login(username1, 'user');
          console.log("loginin" + username);
          // navigate('/');
        }
        else if (res.status === 200) {
          console.log("Admin login");
          setLoggedin(true);
          login(username1, 'admin');
          // navigate('/admin');
        }
        return res.text();
      })
      .then(data => {
        alert(data)
      })
      .catch(err => {
        console.log(err);
      });
  };
  useEffect(() => {
    setLoggedin(username !== undefined);
  }
    , []);
  useEffect(() => {
    if (loggedin) {
      navigate(mode === 'user' ? '/' : '/admin');
    }
  }, [loggedin, mode]);
  return (loggedin === false ?
    (<>
      <Header />
      <MDBContainer className="p-3 my-5 d-flex flex-column w-50">

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
            <div className="form-group mb-4">
              <label htmlFor="gender" > Gender: </label>
              <Form.Select
                aria-label="Default select example"
                value={editgender}
                onChange={handleGenderChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
                <option value="">Not to Specify</option>
              </Form.Select>
            </div>
            <button
              className="mb-4 w-100"
              style={{
                backgroundColor: "#6c757d",
                color: "white",
                fontSize: "17px",
                borderRadius: "4px",
                border: "white",
                height: "40px",
                marginTop: "10px"
              }}
              onClick={handleRegister}
            >
              Register
            </button>

          </MDBTabsPane>

        </MDBTabsContent>

      </MDBContainer></>) : (mode === 'user' ? <Navigate to='/' /> : <Navigate to='/admin' />)
  );
}
export default Login;

