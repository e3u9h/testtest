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
import { useNavigate } from 'react-router-dom';
import Header from './components/header';
import { useSimpleNotification } from './components/SimpleNotification';
import Form from 'react-bootstrap/Form';
import { useAuth } from './provider/context';
import request from './utils/request';

const Login = (props) => {
  const { login, username, mode } = useAuth();
  const { showNotification, NotificationComponent } = useSimpleNotification();
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
    // check the format of the username and password and whether the 2 input passwords are the same
    if (editUsername === '') {
      showNotification("Please enter a username.", 'warning');
    } else if (editUsername.length >= 20) {
      showNotification("The length of the username should be smaller than 20.", 'warning');
    } else if (!editPassword || !editPassword2) {
      showNotification("Please enter a password.", 'warning');
    } else if (editPassword.length <= 4 || editPassword.length >= 20) {
      showNotification("The length of the password should be larger than 4 and smaller than 20.", 'warning');
    } else if (editPassword !== editPassword2) {
      showNotification("Password mismatch!", 'error');
    } else {
      // if the format is correct, send the request to the backend
      request.post("createuser", userInfo)
        .then(res => {
          if (res.status === 201) {
            console.log("here");
            // if the registration is successful, automatically login
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
                showNotification(err1.response?.data?.message || "Login failed after registration", 'error');
              });
          }
          showNotification(res.data || "Registration successful!", 'success');
        })
        .catch(err => {
          // if the registration failed, alert the error message
          console.log(err);
          showNotification(err.response?.data || "Registration failed", 'error');
        });
    }
  }

  const handleJustifyClick = (value) => {
    // justifyActive is to determin which tab (Register or Login) is active
    // this function is to set justifyActive to the clicked tab
    if (value === justifyActive) {
      return;
    }
    setJustifyActive(value);
  };

  const handleUserSubmit = async (event) => {
    // this function is to handle the login request
    event.preventDefault();
    console.log(editUsername, editPassword);
    const userInfo = {
      username: editUsername,
      pwd: editPassword
    };
    // send the login request to the backend
    request.post("login/user", userInfo)
      .then(res => {
        console.log('here login');
        console.log(res);
        if (res.status === 201) {
          // response status 201, means that the user mode is "user" (setted by the backend function)
          // set loggedin to be true, which will be used for navigation after login
          setLoggedin(true);
          // call the login function from the context to save the user information
          login(editUsername, 'user', res.data.token);
          console.log("loginin " + editUsername);
        } else if (res.status === 200) {
          // response status 200 means that the user mode is "admin"
          console.log("Admin login");
          setLoggedin(true);
          login(editUsername, 'admin', res.data.token);
        } 
        showNotification(res.data?.message || "Login successful!", 'success');
      })
      .catch(err => {
        // if the login failed, alert the error message
        console.error("Login failed:", err);
        const errorMessage = err.response?.data?.message || err.response?.data || "Login failed";
        showNotification(errorMessage, 'error');
      });
  };
  useEffect(() => {
    // when first loading the page, set loggedin according to the information of the context
    setLoggedin(username !== undefined);
  }, [username]);

  useEffect(() => {
    // when the loggedin state or mode changes, navigate to the corresponding page
    // (main page or admin page) if the user is logged in
    console.log(loggedin, mode);
    if (loggedin) {
      navigate(mode === 'user' ? '/' : '/admin');
    }
  }, [loggedin, mode, navigate]);
  return (
    (<>
      <Header />
      <NotificationComponent />
      <MDBContainer className="p-3 my-5 d-flex flex-column w-50">{/* tabs */}
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
          {/* the login pane */}
          <MDBTabsPane show={justifyActive === 'login'}>
            {/* input for username */}
            <div className="form-group mb-4">
              <label htmlFor="newusername">Username</label>
              <input type="text" className="form-control" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} />
            </div>
            {/* input for password */}
            <div className="form-group mb-4">
              <label htmlFor="newpwd">Password</label>
              <input type="password" className="form-control" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} />
            </div>
            {/* Login button */}
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
          {/* the register pane */}
          <MDBTabsPane show={justifyActive === 'register'}>
            {/* input for username */}
            <div className="form-group mb-4">
              <label htmlFor="newusername">Username</label>
              <input type="text" className="form-control" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} />
            </div>
            {/* input for password */}
            <div className="form-group mb-4">
              <label htmlFor="newpwd">Password</label>
              <input type="password" className="form-control" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} />
            </div>
            {/* input for password recheck */}
            <div className="form-group mb-4">
              <label htmlFor="newpwd2">Recheck Password</label>
              <input type="password" className="form-control" value={editPassword2} onChange={(e) => setEditPassword2(e.target.value)} />
            </div>
            {/* dropdown menu for gender selection */}
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
            {/* the register button */}
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

      </MDBContainer></>) 
  );
}
export default Login;

