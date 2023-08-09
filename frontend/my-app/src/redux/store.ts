import { configureStore, AnyAction } from '@reduxjs/toolkit';
import loginReducer, { Action } from './loginReducer';

const store = configureStore({
  reducer: {
    login: loginReducer,
  },
});

export default store;
