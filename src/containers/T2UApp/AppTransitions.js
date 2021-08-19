import React from "react";
import { Switch, Redirect, withRouter, Route } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Login from "../../components/Login/Login";
import Profile from "../../components/Profile/Profile";
import Register from "../../components/Register/Register.js";

import TrailerInfo from "../../components/TrailerInfo/TrailerInfo";
import SearchTrailers from "../../components/SearchTrailers/SearchTrailers";
import LicenseeInfo from "../../components/TrailerInfo/LicenseeModal/LicenseeModal";
import BookingInfo from "../../components/BookingInfo/BookingInfo";

import Home from "../../components/Home/Home";
import AuthRoute from "../../components/helpers/AuthRoute";
import "./T2UApp.css";
import CheckoutForm from "components/Payment/CheckoutForm";
import PrivacyPolicy from "components/Navigation/Footer/PrivacyPolicy";

const AppTransitions = ({ location }) => {
  return (
    <div className="height100">
      {/* 
        TransitionGroup and CSS Transitiion to apply a fade effect for all pages
      */}
      <TransitionGroup className="transition-group">
        <CSSTransition
          key={location.key}
          timeout={{ enter: 300, exit: 300 }}
          classNames={"fade"}
        >
          <section className="route-section">
            <Switch location={location}>
              {/* Routing for the entire project */}
              <AuthRoute path="/" exact component={Home} />
              <AuthRoute path="/login" exact component={Login} />
              <AuthRoute path="/profile" exact component={Profile} />
              <AuthRoute path="/register" exact component={Register} />
              <AuthRoute
                path="/trailer/:trailerId"
                exact
                component={TrailerInfo}
              />
              <AuthRoute path="/search" exact component={SearchTrailers} />
              <AuthRoute
                path="/licensee/:licenseeId"
                exact
                component={LicenseeInfo}
              />
              <AuthRoute
                path="/booking/checkout"
                exact
                component={CheckoutForm}
              />
              <AuthRoute
                path="/booking/:bookingId"
                exact
                component={BookingInfo}
              />
              <Route path="/privacy-policy" exact component={PrivacyPolicy} />

              <Redirect to="/" />
            </Switch>
          </section>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
};

export default withRouter(AppTransitions);
