// export default NavigationBar;
import React, { Fragment } from "react";
import { Link } from "react-router-dom";
// JavaScript plugin that hides or shows a component based on your scroll
import Headroom from "headroom.js";

// reactstrap components
import {
  UncontrolledCollapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
  // UncontrolledTooltip
} from "reactstrap";
import { connect } from "react-redux";
import { logOutUser } from "../../../redux/actions/userActions";
import { startLoading } from "../../../redux/actions/UIActions";

import NotificationPanel from "../../NotificationPanel/NotificationPanel";

/* Props:
  authenticated (redux) : If user is signed in or not (Store -> user)
  logOutUser() : userAction
  startLoading() :UIAction -> set Loading to true
*/

class NavigationBar extends React.Component {
  componentDidMount() {
    let headroom = new Headroom(document.getElementById("navbar-main"));
    // initialise
    headroom.init();
  }
  state = {
    collapseClasses: "",
    collapseOpen: false,
  };
  //methods to handle dropdown nav menus on small displays
  onExiting = () => {
    this.setState({
      collapseClasses: "collapsing-out",
    });
  };

  onExited = () => {
    this.setState({
      collapseClasses: "",
    });
  };

  render() {
    return (
      <>
        <header className="header-global">
          <Navbar
            className="navbar-main navbar-transparent navbar-light headroom"
            expand="lg"
            id="navbar-main"
          >
            <Container>
              <NavbarBrand className="mr-lg-5" to="/" tag={Link}>
                <h4 style={{ color: "white" }}>Trailer 2 You</h4>
              </NavbarBrand>
              <button className="navbar-toggler" id="navbar_global">
                <span className="navbar-toggler-icon" />
              </button>
              <UncontrolledCollapse
                toggler="#navbar_global"
                navbar
                className={this.state.collapseClasses}
                onExiting={this.onExiting}
                onExited={this.onExited}
              >
                <div className="navbar-collapse-header">
                  <Row>
                    <Col className="collapse-brand" xs="6">
                      <Link to="/">Trailer 2 You</Link>
                    </Col>
                    <Col className="collapse-close" xs="6">
                      <button className="navbar-toggler" id="navbar_global">
                        <span />
                        <span />
                      </button>
                    </Col>
                  </Row>
                </div>
                <Nav className="navbar-nav-hover ml-auto" navbar>
                  {/* if a user is logged in, Navbar should have options for

                  1. Notifications
                  2. Profile
                  3. Logout */}
                  {this.props.authenticated ? (
                    <Fragment>
                      <NavLink>
                        <NavItem>
                          <NotificationPanel />
                        </NavItem>
                      </NavLink>

                      <NavLink href="/profile">
                        <NavItem onClick={() => this.props.startLoading()}>
                          Profile
                        </NavItem>
                      </NavLink>
                      <NavLink>
                        <NavItem onClick={() => this.props.logOutUser()}>
                          Logout
                        </NavItem>
                      </NavLink>
                    </Fragment>
                  ) : (
                    //if not signed in, options shown for logging in or sign up
                    <Fragment>
                      <NavLink href="/login">
                        <NavItem>Login</NavItem>
                      </NavLink>
                      <NavLink href="/register">
                        <NavItem>Register</NavItem>
                      </NavLink>
                    </Fragment>
                  )}
                </Nav>
              </UncontrolledCollapse>
            </Container>
          </Navbar>
        </header>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated, // If a user is signed in or not
});

const mapDispatchToProps = {
  logOutUser, //redux action to log user out
  startLoading, // set loading to true in store -> UI for spinners
};

export default connect(mapStateToProps, mapDispatchToProps)(NavigationBar);
