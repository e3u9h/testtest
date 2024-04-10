import { Container } from '@material-ui/core';
import * as React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useState } from 'react';
import { BACK_END } from './App';
import { Link } from 'react-router-dom';

class Admin extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        currentPage: 'addUpdatePage',
      };
    }
  
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
                type="submit"
                className="btn btn-secondary"
                style={{ flex: '0 0 50%' }}
                onClick={() => this.handleButtonClick('addUpdatePage')}
              >
                Add User and Update Password
              </button>
              <button
                type="submit"
                className="btn btn-secondary"
                style={{ flex: '0 0 25%' }}
                onClick={() => this.handleButtonClick('deleteUserPage')}
              >
                Delete User
              </button>
              <button
                type="submit"
                className="btn btn-secondary"
                style={{ flex: '0 0 25%' }}
                onClick={() => this.handleButtonClick('listUserPage')}
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

    handleSubmit = (event) => {
        const username = document.getElementById("addUsername").value;
        const newpwd = document.getElementById("addPassword").value;
        const userInfo = {
            newusername: username,
            newpwd: newpwd
        };
        fetch(BACK_END + "createuser", {
            method: "POST",
            body: JSON.stringify(userInfo),
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(res => {
                if (res.status === 201) {

                }
                return res.text();
            }).then(data => {
                alert(data);
                window.location.reload(true);
            }).catch(err => {
                console.log(err);
            });
        event.preventDefault();

    }
    renderFormGroup = (label, id, type) => (
        <div className="row mb-3">
            <label htmlFor={id} className="col-sm-2 col-form-label">{label}</label>
            <div className="col-sm-10">
                <input type={type} className="form-control" id={id} />
            </div>
        </div>
    );

    render() {
        return (
            <div className='border' style={{ padding: '20px' }}>
                <form onSubmit={this.handleSubmit}>
                    <div className="row mb-3">
                        <h3 id="addTtitle">Add User</h3>
                    </div>
                    {this.renderFormGroup("Username:", "addUsername", "text")}
                    {this.renderFormGroup("Password:", "addPassword", "password")}
                    <button type="submit" className="btn btn-success">Create</button>
                </form>
            </div>
        );
    }
}

class updatePassword extends React.Component {

    handleUpdate = (event) => {
        event.preventDefault();
        const username = document.querySelector("#updateOldUsername").value;
        const newpwd = document.getElementById('updatePassword').value;

        const newObj = {
            username: username,
            newpwd: newpwd
        };

        if (!username) {
            window.alert("Invalid input.\nPlease enter the original username.");
        } else if (!newpwd) {
            window.alert("Invalid input.\nPlease enter the updating password.");
        } else if (newpwd.length <= 4 || newpwd.length >= 20) {
            window.alert("Invalid input.\n The length of the password should be >4 and <20.");
        } else {
            fetch(BACK_END + 'adminchangepwd', {
                method: 'PUT',
                body: JSON.stringify(newObj),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(res => {
                    if (res.status === 200) {

                    }
                    return res.text();
                })
                .then(data => {
                    alert(data);
                    window.location.reload(true);
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }

    renderFormGroup = (label, id, type) => (
        <div className="row mb-3">
            <label htmlFor={id} className="col-sm-2 col-form-label">{label}</label>
            <div className="col-sm-10">
                <input type={type} className="form-control" id={id} />
            </div>
        </div>
    );

    render() {
        return (
            <div className='border' style={{ padding: '20px' }}>
                <form onSubmit={this.handleUpdate}>
                    <div className="row mb-3">
                        <h3 id="updateTtitle">Update Password</h3>
                    </div>
                    {this.renderFormGroup("Username:", "updateOldUsername", "text")}
                    {this.renderFormGroup("Updated Password:", "updatePassword", "password")}
                    <button type="submit" className="btn btn-secondary">Update</button>
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

    getAllUser = async () => {
        try {
            const res = await fetch(BACK_END + 'reportusers', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            const userList = await res.json();
            this.setState({ userList });
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    }

    render() {
        return (
            <InfiniteScroll
                dataLength={this.state.userList.length}
                next={null}
                hasMore={false}
                scrollableTarget="scrollableDiv"
                endMessage={
                    <p style={{ textAlign: 'center' }}>
                        <ViewUserList userInfos={this.state.userList} />
                        <h6>That's all user :)</h6>
                    </p>
                }>
            </InfiniteScroll>
        );
    }
}

const UserView = (props) => {
    return (
        <form className="row g-3 border-bottom" style={{ padding: '20px' }}>
            <div className="col-auto" style={{ width: '50%', textAlign: 'center' }}>
                <label htmlFor="interest" className="col-form-label" style={{ fontWeight: 'bold' }}>
                    {props.name}
                </label>
            </div>
            <div className="col-auto" style={{ width: '25%' }}></div>
            <div className="col-auto" style={{ width: '25%', textAlign: 'center' }}>
                <Link to={`/${props.name}`}>
                    <button type="button" className="btn btn-secondary">
                        View Details
                    </button>
                </Link>
            </div>
        </form>
    );
};

function ViewUserList({ userInfos }) {

    return (
        <div className="container-fluid border" style={{ padding: '20px' }}>
            <div className="row mb-3">
                <h3 id="updateTitle"> List User </h3>
            </div>
            <div className='row g-3 border-bottom' style={{ padding: '20px' }}>
                <div className="col-auto" style={{ width: '50%', textAlign: 'center' }}>
                    <h5> Username </h5>
                </div>
                <div className="col-auto" style={{ width: '25%' }}></div>
                <div className="col-auto" style={{ width: '25%', textAlign: 'center' }}>
                    <h5> Operation </h5>
                </div>
            </div>
            {userInfos.map((userInfo, index) =>
                <UserView name={userInfo.username} id={userInfo.id} key={index} />
            )}
        </div>
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

    getAllUser = async () => {
        try {
            const res = await fetch(BACK_END + 'reportusers', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            const userList = await res.json();
            this.setState({ userList });
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    }

    render() {
        return (
            <InfiniteScroll
                dataLength={this.state.userList.length}
                next={null}
                hasMore={false}
                scrollableTarget="scrollableDiv"
                endMessage={
                    <p style={{ textAlign: 'center' }}>
                        <DeleteUserList userInfos={this.state.userList} />
                        <h6>That's all user :)</h6>
                    </p>
                }>
            </InfiniteScroll>
        );
    }
}

function DeleteUserList({ userInfos }) {

    return (
        <>
            <div className="container-fluid border" style={{ padding: '20px' }}>
                <div class="row mb-3">
                    <h3 id="updateTtitle"> Delete User </h3>
                </div>
                <div className='row g-3 border-bottom' style={{ padding: '20px' }}>
                    <div class="col-auto" style={{ width: '50%', textAlign: 'center', }}>
                        <h5> Username </h5>
                    </div>
                    <div class="col-auto" style={{ width: '25%', textAlign: 'center' }}>
                        <h5> Report </h5>
                    </div>
                    <div class="col-auto" style={{ width: '25%', textAlign: 'center' }}>
                        <h5> Operation </h5>
                    </div>
                </div>
                {userInfos.map((userInfo, index) =>
                    <DeleteUserCase name={userInfo.username} report={userInfo.report_counter} key={index} />
                )}
            </div >
        </>
    );
}

class DeleteUserCase extends React.Component {

    handleDelete = async () => {
        try {
            const response = await fetch(`${BACK_END}user/${this.props.name}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (response.status === 204) {
                alert('User successfully deleted.');
                window.location.reload();
            } else {
                const data = await response.text();
                alert(data);
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred while deleting the user.');
        }
    };

    render() {
        return (
            <form className='row g-3 border-bottom' style={{ padding: '20px' }}>
                <div className="col-auto" style={{ width: '50%', textAlign: 'center' }}>
                    <label htmlFor="interest" className="col-form-label" style={{ fontWeight: 'bold' }}> {this.props.name} </label>
                </div>
                <div className="col-auto" style={{ width: '25%', textAlign: 'center' }}>
                    <label htmlFor="interest" className="col-form-label" style={{ fontWeight: 'bold' }}> {this.props.report} </label>
                </div>
                <div className="col-auto" style={{ width: '25%', textAlign: 'center' }}>
                    <button type="button" className="btn btn-secondary" onClick={this.handleDelete}> Delete </button>
                </div>
            </form>
        );
    }
}

export { Admin };
