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
import request from './utils/request';




const Login = (props) => {
  const { login, username, mode } = useAuth();
  const [loggedin, setLoggedin] = useState(username !== undefined);
  const [justifyActive, setJustifyActive] = useState('login');
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editPassword2, setEditPassword2] = useState('');
  const [editgender, setEditgender] = useState("");
  const navigate = useNavigate();

  const handleRegister = (event) => {
    event.preventDefault();
    console.log(editUsername, editPassword, editPassword2, editgender)
    const userInfo = {
      newusername: editUsername,
      newpwd: editPassword,
      gender: editgender
    };
    if (editUsername === '') {
      window.alert("Please enter a username.");
    } else if (editUsername.length >= 20) {
      window.alert("The length of the username should besmaller than 20.");
    } else if (!editPassword || !editPassword2) {
      window.alert("Please enter a password");
    } else if (editPassword.length <= 4 || editPassword.length >= 20) {
      window.alert("The length of the password should be larger than 4 and smaller than 20.");
    } else if (editPassword !== editPassword2) {
      window.alert("Password mismatch!");
    } else {
      request.post("createuser", userInfo)
        .then(res => {
          if (res.status === 201) {
            console.log("here");
            request.post("login/user", {
              username: editUsername,
              pwd: editPassword
            })
              .then(res1 => {
                console.log(res1);
                if (res1.status === 201) {
                  setLoggedin(true);
                  login(editUsername, 'user', res1.data.token);
                  console.log("loginin " + editUsername);
                }
              })
              .catch(err1 => {
                console.error("Login failed:", err1);
                alert(err1.response.data.message);
              });
          }
          alert(res.data);
        })
        .catch(err => {
          console.log(err);
          alert(err.response.data);
        });
    }
  }

  const handleJustifyClick = (value) => {
    if (value === justifyActive) {
      return;
    }
    setJustifyActive(value);
  };

  const handleUserSubmit = async (event) => {
    event.preventDefault();
    console.log(editUsername, editPassword);
    const userInfo = {
      username: editUsername,
      pwd: editPassword
    };
    request.post("login/user", userInfo)
      .then(res => {
        console.log('here login');
        console.log(res);
        if (res.status === 201) {
          setLoggedin(true);
          login(editUsername, 'user', res.data.token);
          console.log("loginin " + editUsername);
          // navigate('/');
        } else if (res.status === 200) {
          console.log("Admin login");
          setLoggedin(true);
          login(editUsername, 'admin', res.data.token);
          // navigate('/admin');
        } 
        alert(res.data.message);
      })
      .catch(err => {
        console.error("Login failed:", err);
        alert(err.response.data.message);
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
              <input type="text" className="form-control" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} />
            </div>
            <div className="form-group mb-4">
              <label htmlFor="newpwd">Password</label>
              <input type="password" className="form-control" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} />
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
              <input type="text" className="form-control" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} />
            </div>
            <div className="form-group mb-4">
              <label htmlFor="newpwd">Password</label>
              <input type="password" className="form-control" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} />
            </div>
            <div className="form-group mb-4">
              <label htmlFor="newpwd2">Recheck Password</label>
              <input type="password" className="form-control" value={editPassword2} onChange={(e) => setEditPassword2(e.target.value)} />
            </div>
            <div className="form-group mb-4">
              <label htmlFor="gender" > Gender: </label>
              <Form.Select
                aria-label="Default select example"
                defaultValue=""
                value={editgender}
                onChange={(e) => setEditgender(e.target.value)}
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

