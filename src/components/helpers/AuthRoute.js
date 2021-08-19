import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import jwtDecode from "jwt-decode";
import { logOutUser, setLocalUser } from "../../redux/actions/userActions";
import { toast } from "react-toastify";

/* Props:
  component : Component related to that route
  rest.path : Path according to the URL
  authenticated : If the user is authenticated or not (Redux)
    logOutUser() :Redux action for logging out
    setLocalUSer() : set user object in redux store
  */

const AuthRoute = ({ component: Component, authenticated, ...rest }) => {
  const token = localStorage.getItem("IDToken"); //Fetch IDToken, i.e the auth token from localStorage
  if (token) {
    const decodedToken = jwtDecode(token); //Decode token to get expiration time (seconds) using jwt-decode
    if (decodedToken.exp * 1000 < Date.now()) {
      //if current time is past expiration time, log user out using reduxAction and redirect to login page
      rest.logOutUser();
      toast.error("You have been logged out due to inactivity!");
      return <Redirect to="/login" />;
    } else {
      //if token has not expired, set user in reduxStore -> user
      rest.setLocalUser(JSON.parse(localStorage.getItem("user")));
    }
  }
  /* 
        If user is authenticated, he can visit all pages except :
            1. Login
            2. Register

        If this is attempted, redirct to the home page
    */

  if (authenticated) {
    if (rest.path === "/login" || rest.path === "/register") {
      return <Route {...rest} render={(props) => <Redirect to="/" />} />;
    } else {
      return <Route {...rest} render={(props) => <Component {...props} />} />;
    }
  }

  /* 
        If user is NOT authenticated, he can visit only two pages :
            1. Login
            2. Register
        Any other request redirects to the login page
    */
  if (rest.path === "/login" || rest.path === "/register") {
    return <Route {...rest} render={(props) => <Component {...props} />} />;
  }
  return <Redirect to="/login" />;
};

// Get user authentication status from redux store --> user

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
});

// get redux actions for logging out user (logOutUser) and setting user in redux store (setLocalUser)

const mapDispatchToProps = {
  logOutUser,
  setLocalUser,
};
//connect component to reduxStore
export default connect(mapStateToProps, mapDispatchToProps)(AuthRoute);
