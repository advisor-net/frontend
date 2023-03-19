import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { reducer as sessionReducer } from '../session/sessionSlice';

const store = configureStore({
  reducer: {
    session: sessionReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;
