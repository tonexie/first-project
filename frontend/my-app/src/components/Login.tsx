import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import LoginAuth from './LoginAuth';
import { loginSuccess, logout, setUserName } from '../redux/loginActions';
import createBackendAPI, {UserProfile} from "../api/ApiBackend";

interface LoginProps {
  loggedIn: boolean;
  name: string;
  dispatch: Function;
}

const loginAuth = new LoginAuth();

const Login: React.FC<LoginProps> = ({ loggedIn, name: loggedName, dispatch }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [userName, updateUserName] = useState<string>('');

  const signInWithEmailAndPasswordHandler = (
    event: React.FormEvent,
    email: string,
    password: string
  ) => {
    event.preventDefault();
    
    loginAuth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        dispatch(loginSuccess(email));
        return fetchUserProfile(email);
      })
      .catch((error) => {
        const errorMessage = error.message.replace('Firebase: ', '');
        setError(errorMessage);
        console.error('Error signing in with password and email', error);
      });
  };
  
  // Create the fetchUserProfile function
  const fetchUserProfile = (email: string) => {
    createBackendAPI().then((backendAPI) => {
      backendAPI.fetchUserProfile()
        .then((profiles) => {
          console.log('User profile fetched:', profiles);
          const userProfile = profiles.find((profile: UserProfile) => profile.Email === email);
        
          if (userProfile) {
            dispatch(setUserName(userProfile.UserName));
            updateUserName(userProfile.UserName);
          } else {
            console.error('No user profile found for the given email:', email);
          }
        })
        .catch((error) => {
          console.error('Error fetching user profile from backend:', error);
        });
    });
  };
  

  const logoutHandler = () => {
    loginAuth.signOut();
    dispatch(logout());
  };

  const clearErrors = () => {
    setError(null);
  };

  return (
    <div>
      {loggedIn ? (
        <div>
          <h3>Welcome, {loggedName}!</h3>
          <Button variant="primary" onClick={logoutHandler}>
            Logout
          </Button>
        </div>
      ) : (
        <Form>
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
          {error !== null && <div style={{color: 'red'}}>{error}</div>}

          <Button
            variant="primary"
            onClick={(event) =>
              signInWithEmailAndPasswordHandler(event, email, password)
            }
            style={{ marginRight: '10px', marginLeft: '5px'}}
          >
            Login
          </Button>
        </Form>
      )}
    </div>
  );
};

const mapStateToProps = (state: { login: { loggedIn: boolean; name: string } }) => ({
  loggedIn: state.login.loggedIn,
  name: state.login.name,
});

export default connect(mapStateToProps)(Login);
