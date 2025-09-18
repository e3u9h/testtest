import { Container } from '@mui/material';
import * as React from 'react';
import { Link } from 'react-router-dom';
import request from './utils/request';

class Admin extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        currentPage: 'addUpdatePage',
      };
    }
    //   button: select the desired function  
    handleButtonClick = (page) => {
      this.setState({ currentPage: page });
    };
    render() {
      const { currentPage } = this.state;
  
      return (
        <>
          <Container fluid>
          <div style={{ display: 'flex', width: '100%' }}>
              <button
                type="submit" className="btn btn-secondary" style={{ width: '25%' }} onClick={() => this.handleButtonClick('addUpdatePage')}
              >
                Add User and Update Password
              </button>
              <button
                type="submit" className="btn btn-secondary" style={{ width: '25%' }} onClick={() => this.handleButtonClick('deleteUserPage')}
              >
                Delete User
              </button>
              <button
                type="submit" className="btn btn-secondary" style={{ width: '25%' }} onClick={() => this.handleButtonClick('listUserPage')}
              >
                List User
              </button>
            </div>
            <div id="scrollableDiv" className="border" style={{ height: '80vh', overflow: 'auto' }}>
              {currentPage === 'addUpdatePage' && (
                <>
                  <AddUser />
                  <UpdatePassword />
                </>
              )}
              {currentPage === 'deleteUserPage' && <DeleteUser />}
              {currentPage === 'listUserPage' && <ListUser />}
            </div>
          </Container>
        </>
      );
    }
  }

  class AddUser extends React.Component {

    constructor(props) {
      super(props);
      this.usernameRef = React.createRef();
      this.passwordRef = React.createRef();
    }
  
    handleSubmit = async (event) => {
      event.preventDefault();
      const username = this.usernameRef.current.value;
      const newPassword = this.passwordRef.current.value;

    // handle submission, sends AddUser request to create a new user
    if (!username.trim() || !newPassword.trim()) {
        alert("Username and password cannot be empty.");
        return;
      }
    
      if (newPassword.length <= 4 || newPassword.length >= 20) {
        alert("Password must be between 4 and 20 characters long.");
        return;
      }
    
      try {
        const response = await request.post("/createuser", {
          newusername: username,
          newpwd: newPassword
        });
        const data = response.data; 
        alert(data);
        window.location.reload(true);
      } catch (error) {
        console.log(error); 
      }
    }
  
    renderFormGroup = (label, id, type, inputRef) => (
      <div className="mb-3 row">
        <label htmlFor={id} className="col-form-label col-sm-2">{label}</label>
        <div className="col-sm-10">
          <input ref={inputRef} type={type} className="form-control" id={id} />
        </div>
      </div>
    );
  
    render() {
      return (
        <div className='border p-4'>
          <form onSubmit={this.handleSubmit}>
            <div className="mb-3 row">
              <h3 id="addTtitle">Add User</h3>
            </div>
            {this.renderFormGroup("Username:", "addUsername", "text", this.usernameRef)}
            {this.renderFormGroup("Password:", "addPassword", "password", this.passwordRef)}
            <button type="submit" className="btn btn-secondary">Create</button>
          </form>
        </div>
      );
    }
  }

  class UpdatePassword extends React.Component {
    constructor(props) {
      super(props);
      this.usernameRef = React.createRef();
      this.passwordRef = React.createRef();
    }
    // handle submission, sends UpdatePassword request to update a new password 
    handleUpdate = async (event) => {
      event.preventDefault();
      const username = this.usernameRef.current.value;
      const newPassword = this.passwordRef.current.value;
  
      if (!newPassword.trim()) {
        alert("Updated password cannot be empty.");
        return; 
      }
  
      if (newPassword.length <= 4 || newPassword.length >= 20) {
        alert("Password must be between 4 and 20 characters long.");
        return; 
      }
  
      try {
        const response = await request.put("/adminchangepwd", {
          username: username,
          newpwd: newPassword,
        });
        const data = response.data; 
        alert(data); 
        window.location.reload(true); 
      } catch (error) {
        console.log(error); 
        if (error.response && error.response.status === 404) {
          alert("The username doesn't exist.");
        } else {
          alert("An error occurred while updating the password.");
        }
      }
    };
  
    renderFormGroup = (label, id, type, inputRef) => (
      <div className="mb-3 row">
        <label htmlFor={id} className="col-form-label col-sm-2">
          {label}
        </label>
        <div className="col-sm-10">
          <input ref={inputRef} type={type} className="form-control" id={id} />
        </div>
      </div>
    );
  
    render() {
      return (
        <div className="border p-4">
          <form onSubmit={this.handleUpdate}>
            <div className="mb-3 row">
              <h3 id="updateTtitle">Update Password</h3>
            </div>
            {this.renderFormGroup(
              "Username:",
              "updateOldUsername",
              "text",
              this.usernameRef
            )}
            {this.renderFormGroup(
              "Updated Password:",
              "updatePassword",
              "password",
              this.passwordRef
            )}
            <button type="submit" className="btn btn-secondary">
              Update
            </button>
          </form>
        </div>
      );
    }
  }

  class ListUser extends React.Component {
    constructor(props) {
      super(props);
      this.state = { userList: [] };
    }
  
    componentDidMount() {
      this.getAllUser();
    }
    // Fetch all users from the server
    getAllUser = async () => {
      try {
        const res = await request.get('listusers', {
          headers: {
            'Accept': 'application/json'
          }
        });
        const userList = res.data;
        this.setState({ userList });
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    }
  
    render() {
      return (
        <div className="container-fluid border p-4">
          <div className="mb-3 row">
            <h3 id="listTitle">List User</h3>
          </div>
          <div className="row g-3 border-bottom p-3">
            <div className="col-auto" style={{ width: '50%', textAlign: 'center' }}>
              <h5>Username</h5>
            </div>
            <div className="col-auto" style={{ width: '25%' }}></div>
            <div className="col-auto" style={{ width: '25%', textAlign: 'center' }}>
              <h5>Operation</h5>
            </div>
          </div>
          <ViewUserList userInfos={this.state.userList} />
        </div>
      );
    }
  }
  
  const UserView = (props) => {
    return (
      <div className="row g-3 border-bottom p-3">
        <div className="col-auto" style={{ width: '50%', textAlign: 'center' }}>
          <label className="col-form-label fw-bold">{props.name}</label>
        </div>
        <div className="col-auto" style={{ width: '25%' }}></div>
        <div className="col-auto" style={{ width: '25%', textAlign: 'center' }}>
          <Link to={`/${props.name}`}>
            <button type="button" className="btn btn-secondary">
              View Details
            </button>
          </Link>
        </div>
      </div>
    );
  };
  // Render the list of users
  function ViewUserList({ userInfos }) {
    return (
      <>
        {userInfos.map((userInfo, index) =>
          <UserView name={userInfo.username} id={userInfo.id} key={index} />
        )}
      </>
    );
  }

class DeleteUser extends React.Component {
    constructor(props) {
      super(props);
      this.state = { userList: [] };
    }
  
    componentDidMount() {
      this.getAllUser();
    }
    // Fetch all users from the server 
    getAllUser = async () => {
      try {
        const res = await request.get('reportusers', {
          headers: {
            'Accept': 'application/json'
          }
        });
        const userList = res.data;
        this.setState({ userList });
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    }
  
    render() {
      return (
        <div className="container-fluid border p-4">
          <div className="mb-3 row">
            <h3 id="deleteTtitle">Delete User</h3>
          </div>
          <div className="row g-3 border-bottom p-3">
            <div className="col-auto" style={{ width: '50%', textAlign: 'center' }}>
              <h5>Username</h5>
            </div>
            <div className="col-auto" style={{ width: '25%', textAlign: 'center' }}>
              <h5>Report</h5>
            </div>
            <div className="col-auto" style={{ width: '25%', textAlign: 'center' }}>
              <h5>Operation</h5>
            </div>
          </div>
          <DeleteUserList userInfos={this.state.userList} />
        </div>
      );
    }
  }

  // Render the list of users to be deleted
  function DeleteUserList({ userInfos }) {
    return (
      <>
        {userInfos.map((userInfo, index) =>
          <DeleteUserCase name={userInfo.username} report={userInfo.report_counter} key={index} />
        )}
      </>
    );
  }
  
  class DeleteUserCase extends React.Component {
    // Handle the deletion of a user
    handleDelete = async () => {
      try {
        const response = await request.delete(`user/${this.props.name}`, {
          headers: {
            'Accept': 'application/json'
          }
        });
  
        if (response.status === 204) {
          alert('Delete successfully.');
          window.location.reload();
        } else {
          alert(response.data);
        }
      } catch (error) {
        console.error(error);
        alert('An error occurred while deleting the user.');
      }
    };
  
    render() {
      return (
        <div className="row g-3 border-bottom p-3">
          <div className="col-auto" style={{ width: '50%', textAlign: 'center' }}>
            <label className="col-form-label fw-bold">{this.props.name}</label>
          </div>
          <div className="col-auto" style={{ width: '25%', textAlign: 'center' }}>
            <label className="col-form-label fw-bold">{this.props.report}</label>
          </div>
          <div className="col-auto" style={{ width: '25%', textAlign: 'center' }}>
            <button type="button" className="btn btn-secondary" onClick={this.handleDelete}>Delete</button>
          </div>
        </div>
      );
    }
  }

export { Admin };
// employ claude3 to offer some idea