import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import LoginAuth from './LoginAuth';
import { loginSuccess, logout } from '../redux/loginActions';
import createBackendAPI, {UserProfile} from "../api/ApiBackend";

interface RegisterProps {
  loggedIn: boolean;
  email: string;
  dispatch: Function;
}

const loginAuth = new LoginAuth();

const Register: React.FC<RegisterProps> = ({ loggedIn, dispatch }) => {
  const [userID, setID] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const [hometown, setHometown] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [emptyFieldError, setEmptyFieldError] = useState<string | null>(null);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);


  const signUpWithEmailAndPasswordHandler = (
    event: React.FormEvent
  ) => {
    event.preventDefault();
  
    if (name.trim() === '' || hometown.trim() === '' || email.trim() === '' || password.trim() === '') {
      setEmptyFieldError('Please fill in all fields.');
      setFirebaseError(null);
      return;
    }
  
    loginAuth
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      setSuccessMessage('Registration successful!');
      setEmptyFieldError(null);
      setFirebaseError(null);
      

      const userData: UserProfile = {
        UserID: userID,
        UserName: name,
        Email: email,
        HomeCity: hometown,
        PhotoFileName: '', 
      };

      createBackendAPI().then((backendAPI) => {
        backendAPI.createUserProfile(userData)
          .then((response) => {
            console.log('User data sent to backend:', response);
          })
          .catch((error) => {
            console.error('Error sending user data to backend:', error);
          });
      });
    })
    .catch((error) => {
      const errorMessage = error.message.replace('Firebase: ', ''); 
      setFirebaseError(errorMessage);
      setEmptyFieldError(null);
      console.error('Error signing up with password and email', error);
    });
};
  

  const clearErrors = () => {
    setEmptyFieldError(null);
    setFirebaseError(null);
    setSuccessMessage(null);
  };

  return (
    <div>
      <Form>
        <Form.Group controlId="userName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="userName"
            value={name}
            placeholder="Your Name"
            onChange={(e) => setName(e.currentTarget.value)}
            onFocus={clearErrors}
          />
        </Form.Group>

        <Form.Group controlId="userHometown">
          <Form.Label>Hometown</Form.Label>
          <Form.Control
            type="text"
            name="userHometown"
            value={hometown}
            placeholder="Your Hometown"
            onChange={(e) => setHometown(e.currentTarget.value)}
            onFocus={clearErrors}
          />
        </Form.Group>

        <Form.Group controlId="userEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="userEmail"
            value={email}
            placeholder="example@gmail.com"
            onChange={(e) => setEmail(e.currentTarget.value)}
            onFocus={clearErrors}
          />
        </Form.Group>

        <Form.Group controlId="userPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="userPassword"
            value={password}
            placeholder="Your Password"
            onChange={(e) => setPassword(e.currentTarget.value)}
            onFocus={clearErrors}
          />
        </Form.Group>

        {emptyFieldError && <div style={{ color: 'red' }}>{emptyFieldError}</div>}
        {firebaseError && <div style={{ color: 'red' }}>{firebaseError}</div>}
        {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}

        <Button
          variant="primary"
          onClick={signUpWithEmailAndPasswordHandler}
          style={{ marginLeft: '5px'}}
        >
          Sign up
        </Button>
      </Form>
    </div>
  );
};

const mapStateToProps = (state: {
  login: { loggedIn: boolean; email: string };
}) => ({
  loggedIn: state.login.loggedIn,
  email: state.login.email,
});

export default connect(mapStateToProps)(Register);
