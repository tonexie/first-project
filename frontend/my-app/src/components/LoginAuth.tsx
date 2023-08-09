import { auth } from './FirebaseConfig';
import firebase from 'firebase/compat/app';


class LoginAuth{
  signInWithEmailAndPassword(email: string, password: string) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  createUserWithEmailAndPassword(email: string, password: string) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  signOut() {
    return auth.signOut();
  }

  onAuthStateChanged(callback: (user: firebase.User | null) => void): () => void {
    return auth.onAuthStateChanged(callback); // return the callback object
  }
}

export default LoginAuth;
