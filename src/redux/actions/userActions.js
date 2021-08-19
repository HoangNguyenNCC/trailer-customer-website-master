import {
  SET_ERRORS,
  SET_USER,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_UNAUTHENTICATED,
  STOP_UI_LOAD,
} from "../types";
import axios from "axios";

export const logInUser = (userData, history) => (dispatch) => {
  //For logging in user from the login page
  dispatch({ type: LOADING_UI });
  dispatch({ type: CLEAR_ERRORS });
  axios
    .post("/signin", userData)
    .then(async (res) => {
      const IDToken = res.data.dataObj.token; //Auth token from response
      dispatch({
        type: SET_USER,
        payload: res.data.dataObj.userObj,
      });
      localStorage.setItem("IDToken", IDToken); //Store auth token in localStorage
      localStorage.setItem("user", JSON.stringify(res.data.dataObj.userObj));
      axios.defaults.headers.common["Authorization"] = await IDToken; //set default Authorization head for all forthcoming requests

      dispatch({ type: STOP_UI_LOAD });
      history.push("/"); //Redirect to home page
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data.message,
      });
      dispatch({ type: STOP_UI_LOAD });
    });
};
export const getProfile = () => async (dispatch) => {
  // dispatch({type:LOADING_UI})

  //Get detailed user profile
  await axios
    .get("/profile")
    .then((res) => {
      console.log("PROFILE ", res.data.userObj);
      dispatch({
        type: SET_USER,
        payload: res.data.userObj,
      });
      localStorage.setItem("user", JSON.stringify(res.data.userObj));
      return res.data.userObj;
      // dispatch({ type: STOP_UI_LOAD })
    })
    .catch((err) => {
      console.log(err);
      // dispatch({STOP_UI_LOAD})
    });
};
export const logOutUser = () => (dispatch) => {
  //Log out user by setting authenticated to false and clearing user from store
  localStorage.clear();
  delete axios.defaults.headers.common["Authorization"];
  dispatch({ type: SET_UNAUTHENTICATED });
};

export const setLocalUser = (user) => (dispatch) => {
  dispatch({
    type: SET_USER,
    payload: user,
  });
  axios.defaults.headers.common["Authorization"] = localStorage.getItem(
    "IDToken"
  );
};
