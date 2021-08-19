import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";

import AppTransitions from "./AppTransitions";
import Layout from "../../hoc/Layout/Layout";

import { Provider } from "react-redux";
import store, { persistor } from "../../redux/store";
import axios from "axios";
import { PersistGate } from "redux-persist/lib/integration/react";
import "./T2UApp.css";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { ToastContainer } from "react-toastify";

axios.defaults.baseURL = "https://t2ybeta.herokuapp.com/";

// const token = localStorage.getItem("IDToken");
// if (token) {
//   const decodedToken = jwtDecode(token);
//   console.log(Date.now()-decodedToken.exp)
//   if (decodedToken.exp * 1000 < Date.now()) {
//     console.log("HIIIIIIIIIII")
//     window.location.href = "/login";
//     store.dispatch(logOutUser());
//   } else {
//     axios.defaults.headers.common["Authorization"] = token;
//     store.dispatch({
//       type: SET_USER,
//       payload: JSON.parse(localStorage.getItem("user")),
//     });
//   }
// }

// const promise = loadStripe(
//   "pk_test_51HCsxqGLBR8nomTlmnpEx2ZJnVduO1hAR6hZtDdNQxlkyeaRBaobtSE8ypCRXLAScUswLzCm2l0TF2qlOgn2CDm800dgEJDHRM"
// );

const promise = loadStripe(
  "pk_test_51HCsxqGLBR8nomTlmnpEx2ZJnVduO1hAR6hZtDdNQxlkyeaRBaobtSE8ypCRXLAScUswLzCm2l0TF2qlOgn2CDm800dgEJDHRM"
);

//Load Stripe key (the publishable one)!

class T2UApp extends Component {
  render() {
    // const location = this.props.location;
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Elements stripe={promise}>
            <BrowserRouter>
              <Layout>
                <ToastContainer />
                <AppTransitions />
              </Layout>
            </BrowserRouter>
          </Elements>
        </PersistGate>
      </Provider>
    );
  }
}

export default T2UApp;
