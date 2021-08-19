import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
// import logger from "redux-logger";

import userReducer from "../redux/reducers/userReducer";
import UIReducer from "../redux/reducers/UIReducer";
import dataReducer from "../redux/reducers/dataReducer";

//Config for redux-persist
const persistConfig = {
  key: "root",
  storage: storage, // see "Merge Process" section for details.
};
const INITIAL_STATE = {};
const middleware = [thunk]; //Middlewares used-> thunk for using dispatch as functions,logger for redux state change logging

if (process.env.NODE_ENV === `development`) {
  const { logger } = require(`redux-logger`);

  middleware.push(logger);
}

const reducers = combineReducers({
  user: userReducer,
  UI: UIReducer,
  data: dataReducer,
});
const pReducer = persistReducer(persistConfig, reducers);
const store = createStore(
  pReducer,
  INITIAL_STATE,
  applyMiddleware(...middleware)
);
// const store = createStore(reducers, INITIAL_STATE);
export default store;
export const persistor = persistStore(store);
