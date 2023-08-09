import { auth, getFirebaseAuthToken } from '../components/FirebaseConfig';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BACKEND_URL as string;

if (!BASE_URL) {
  throw new Error('Environment variable for backend API URL is missing.');
}

export interface UserProfile {
  UserID: number;
  UserName: string;
  Email: string;
  HomeCity: string;
  PhotoFileName: string;
}

const createBackendAPI = async () => {
  const firebaseAuthToken = await getFirebaseAuthToken();
  
  const makeRequest = (url: string, method: any, body: any = null) => {
    const headers = {
      Authorization: `Bearer ${firebaseAuthToken}`,
    };

    const options = {
      method,
      headers,
      data: body,
    };

    return axios(url, options)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  };

  return {
    fetchUserProfile: () => {
      const url = `${BASE_URL}/userprofile`;
      return makeRequest(url, 'get');
    },

    createUserProfile: (userData: UserProfile) => {
      const url = `${BASE_URL}/userprofile`;
      return makeRequest(url, 'post', userData);
    },

    updateUserProfile: (userId: number, userData: UserProfile) => {
      const url = `${BASE_URL}/userprofile/${userId}`;
      return makeRequest(url, 'put', userData);
    },

    deleteUserProfile: (userId: number) => {
      const url = `${BASE_URL}/userprofile/${userId}`;
      return makeRequest(url, 'delete');
    },
  };
};

export default createBackendAPI;

