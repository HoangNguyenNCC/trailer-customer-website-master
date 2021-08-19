/*!

=========================================================
* Argon Design System React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-design-system-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-design-system-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
/*eslint-disable*/
import React, { Fragment } from "react";
// reactstrap components
import { NavItem, NavLink, Nav, Container, Row, Col } from "reactstrap";
import { connect } from "react-redux";

/* Props: none
 */
class Footer extends React.Component {
  render() {
    return (
      <>
        <footer className="footer">
          <Container>
            <Row className=" align-items-center justify-content-md-between">
              <Col xs="5">
                <div className="copyright">
                  © {new Date().getFullYear()}{" "}
                  <a href="/" target="_blank">
                    Trailer 2 You
                  </a>
                </div>
              </Col>
              <Col xs="7">
                <Nav className=" nav-footer justify-content-end">
                  {this.props.authenticated && (
                    <Fragment>
                      <NavItem>
                        <NavLink href="/">Home</NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink href="/profile">Profile</NavLink>
                      </NavItem>
                    </Fragment>
                  )}
                  <NavItem>
                    <NavLink href="/privacy-policy">Privacy Policy</NavLink>
                  </NavItem>
                </Nav>
              </Col>
            </Row>
          </Container>
        </footer>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
});

export default connect(mapStateToProps)(Footer);
