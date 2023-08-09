import React, { Component } from "react";
import { Button, Table, Modal, InputGroup, FormControl } from 'react-bootstrap';
import createBackendAPI, { UserProfile } from "../api/ApiBackend";

interface AdminState {
  userProfiles: UserProfile[];
  modalTitle: string;
  userID: number;
  userName: string;
  email: string;
  homeCity: string;
  photoFileName: string;
  show: boolean;
}

export class Admin extends Component<{}, AdminState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      userProfiles: [],
      modalTitle: "",
      userID: 0,
      userName: "",
      email: "",
      homeCity: "",
      photoFileName: "",
      show: false,
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList() {
    createBackendAPI()
      .then((backendAPI) => {
        backendAPI.fetchUserProfile().then((userProfiles) => {
          this.setState({ userProfiles });
        });
      })
      .catch((error) => {
        console.error('Error fetching user profiles:', error);
      });
  }

  handleAddClick = () => {
    this.setState({
      modalTitle: "Add User Profile",
      userName: "",
      email: "",
      homeCity: "",
      photoFileName: "anonymous.png",
      show: true,
    });
  };

  handleEditClick = (profile: UserProfile) => {
    this.setState({
      modalTitle: "Edit User Profile",
      userName: profile.UserName,
      email: profile.Email,
      homeCity: profile.HomeCity,
      photoFileName: profile.PhotoFileName,
      show: true,
    });
  };

  handleClose = () => {
    this.setState({ show: false });
  };

  handleSave = () => {
    const { userID, userName, email, homeCity, photoFileName } = this.state;
    const userProfile: UserProfile = {
      UserID: userID,
      UserName: userName,
      Email: email,
      HomeCity: homeCity,
      PhotoFileName: photoFileName,
    };

    createBackendAPI()
      .then((backendAPI) => {
        if (this.state.modalTitle === "Add User Profile") {
          backendAPI.createUserProfile(userProfile)
            .then(() => {
              this.refreshList();
              this.setState({ show: false });
            })
            .catch((error) => {
              console.error('Error creating user profile:', error);
            });
        } else if (this.state.modalTitle === "Edit User Profile") {
          const userProfileIDToUpdate: number = userID;
          backendAPI.updateUserProfile(userProfileIDToUpdate, userProfile)
            .then(() => {
              this.refreshList();
              this.setState({ show: false });
            })
            .catch((error) => {
              console.error('Error updating user profile:', error);
            });
        }
      })
      .catch((error) => {
        console.error('Error accessing backend API:', error);
      });
  };

  handleDelete = (profileID: number) => {
    if (window.confirm("Are you sure you want to delete this user profile?")) {
      createBackendAPI()
        .then((backendAPI) => {
          backendAPI.deleteUserProfile(profileID)
            .then(() => {
              this.refreshList();
            })
            .catch((error) => {
              console.error('Error deleting user profile:', error);
            });
        })
        .catch((error) => {
          console.error('Error accessing backend API:', error);
        });
    }
  };



  render() {
    const {
      userProfiles,
      modalTitle,
      userName,
      email,
      homeCity,
      photoFileName,
      show,
    } = this.state;
  
    return (
      <div>
        <h1>Admin Panel</h1>
        <div className="d-flex justify-content-end m-1">
          <Button variant="primary" onClick={() => this.handleAddClick()}>
            Add User Profile
          </Button>
        </div>
  
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>User Name</th>
              <th>Email</th>
              <th>Home City</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {userProfiles.map((profile) => (
              <tr key={profile.UserID}>
                <td>{profile.UserName}</td>
                <td>{profile.Email}</td>
                <td>{profile.HomeCity}</td>
                <td>
                  <Button variant="light" onClick={() => this.handleEditClick(profile)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                      <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                    </svg>
                  </Button>
                  <Button variant="light" onClick={() => this.handleDelete(profile.UserID)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
                      <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" />
                    </svg>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
  
        <Modal show={show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{modalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InputGroup className="mb-3">
              <InputGroup.Text>User Name</InputGroup.Text>
              <FormControl
                value={userName}
                onChange={(e) => this.setState({ userName: e.target.value })}
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Email</InputGroup.Text>
              <FormControl
                value={email}
                onChange={(e) => this.setState({ email: e.target.value })}
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Home City</InputGroup.Text>
              <FormControl
                value={homeCity}
                onChange={(e) => this.setState({ homeCity: e.target.value })}
              />
            </InputGroup>
            {modalTitle === "Add User Profile" ? (
              <Button variant="primary" onClick={this.handleSave}>
                Create
              </Button>
            ) : null}
            {modalTitle === "Edit User Profile" ? (
              <Button variant="primary" onClick={this.handleSave}>
                Update
              </Button>
            ) : null}
          </Modal.Body>
        </Modal>
      </div>
    );
  }
  
}
