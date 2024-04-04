import cookie from 'react-cookies';
import * as React from 'react';
import {
  MDBContainer,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBInput,
  MDBTabsPane,
  MDBBtn
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


class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { login: false, username: undefined, mode: 'user', justifyActive: 'login' };
  }

  handleUserSignup = (event) => {
    const username = document.getElementById("newusername").value;
    const newpwd = document.getElementById("newpwd").value;
  }

  handleJustifyClick = (value) => {
    if (value === this.state.justifyActive) {
      return;
    }
    this.setState({ justifyActive: value });
  };

  handleUserSubmit = (event) => {
  
  };
  render() {
    return (this.state.login === false ? 
      (<MDBContainer className="p-3 my-5 d-flex flex-column w-50">

        <MDBTabs pills justify className='mb-3 d-flex flex-row justify-content-between'>
          <MDBTabsItem>
            <MDBTabsLink onClick={() => this.handleJustifyClick('login')} active={this.state.justifyActive === 'login'}>
              Login
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <MDBTabsLink onClick={() => this.handleJustifyClick('signup')} active={this.state.justifyActive === 'signup'}>
              Register
            </MDBTabsLink>
          </MDBTabsItem>
        </MDBTabs>

        <MDBTabsContent>
        <MDBTabsPane show={this.state.justifyActive === 'signup'}>


            <MDBInput wrapperClass='mb-4' label='Username' id='newusername' type='text' />
            <MDBInput wrapperClass='mb-4' label='Password' id='newpwd' type='password' />
            <MDBInput wrapperClass='mb-4' label='Recheck Password' id='newpwd2' type='password' />
            <MDBInput wrapperClass='mb-4' label='Age' id='age' type='number' width={12} />
            <MDBInput wrapperClass='mb-4' label='Email' id='email' type='email' />
            <button className="mb-4 w-100" style={{ backgroundColor: "#6c757d", color: "white", fontSize: "17px", borderRadius: "4px",}} onClick={this.handleUserSignup}>Sign up</button>

        </MDBTabsPane>

        </MDBTabsContent>

      </MDBContainer>) :(this.state.mode === 'user' ? <Navigate to='/'/> : <Navigate to='/admin'/>)
    );
  }
}
export default Login;

