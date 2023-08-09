import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyD-yFtqt9MfmXGfJLn7fgysAhOUuISxTyY",
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "auth-phase2.firebaseapp.com",
    projectID: process.env.REACT_APP_FIREBASE_PROJECT_ID || "auth-phase2",
};

firebase.initializeApp(firebaseConfig);

export const getFirebaseAuthToken = () => {
    return new Promise((resolve, reject) => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          user.getIdToken()
            .then((token) => {
              resolve(token);
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          reject(new Error('User not authenticated'));
        }
      });
    });
  };

export const auth = firebase.auth();
