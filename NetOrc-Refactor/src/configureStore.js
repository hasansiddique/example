import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';

import rootReducer from './rootReducer';

let middleware = [thunkMiddleware];

if (process.env.NODE_ENV !== 'production') {
  const loggerMiddleware = require('redux-logger');
  middleware = [...middleware, loggerMiddleware.createLogger()];
}

const configureStore = (predefinedState) => {
  return createStore(
    rootReducer,
    predefinedState,
    applyMiddleware(...middleware),
  );
};

export default configureStore;
