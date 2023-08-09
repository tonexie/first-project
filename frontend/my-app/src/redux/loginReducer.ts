import { AnyAction } from '@reduxjs/toolkit';
import { LOGIN_SUCCESS, LOGOUT, SET_USER_NAME } from './loginActions';

export interface Action extends AnyAction{
  type: string;
  payload: { email?: string, name?: string };
}

const initialState = {
  loggedIn: false,
  email: '',
  name: '',
};

const loginReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        loggedIn: true,
        email: action.payload.email,
      };
    case LOGOUT:
      return {
        ...state,
        loggedIn: false,
        name: '',
      };
    case SET_USER_NAME:
      return {
        ...state,
        name: action.payload.name,
      };
    default:
      return state;
  }
};

export default loginReducer;
