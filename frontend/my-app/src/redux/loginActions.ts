export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT = 'LOGOUT';
export const SET_USER_NAME = 'SET_USER_NAME';

export const setUserName = (name: string) => ({
  type: SET_USER_NAME,
  payload: { name },
});

export const loginSuccess = (email: string) => ({
  type: LOGIN_SUCCESS,
  payload: { email },
});

export const logout = () => ({
  type: LOGOUT,
});
