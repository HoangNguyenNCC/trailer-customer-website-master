import React, { Component } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
  Spinner,
  UncontrolledAlert,
} from "reactstrap";
import { connect } from "react-redux";
import { logInUser } from "../../redux/actions/userActions";
import { clearErrors } from "../../redux/actions/UIActions";
import errorPopulator from "../Validation/errorPopulator/errorPopulator"; //function to check for erros from state values
import ErrorShow from "../Validation/ErrorShow/ErrorShow"; //Component to display errorText
import ForgotPassword from "./ForgotPassword";

/* Props:
  loading (Redux) : UI loading state (Redux store -> UI)
  clearErrors() : reset error object in the store -> UI
  logInUser() - Redux action for logging user in.
*/

class Login extends Component {
  state = {
    email: "",
    password: "",
    errors: {},
  };
  componentDidMount() {
    //clear any previously stored errors from the reduxStore -> UI
    this.props.clearErrors();
  }

  handleChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;
    this.setState({
      [name]: value,
    });

    //populate with new errors now based on values in state
    const errors = errorPopulator(this.state, name, value);
    this.setState({
      errors: errors,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.state.errors.length > 0) {
      // scroll to top of page if there's some error
      window.scrollTo(0, 0);
      return;
    }
    this.setState({
      loading: true,
    }); //show spinner in button

    let userData = {
      email: this.state.email,
      password: this.state.password,
    };
    //function (redux action) to authenticate login and set user and auth token
    this.props.logInUser(userData, this.props.history);
  };

  render() {
    const { loading } = this.props;
    return (
      <main ref="main">
        <section className="section section-shaped section-lg">
          <div className="shape shape-style-1 bg-gradient-default">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <Container className="pt-7">
            <Row className="justify-content-center">
              <Col lg="5">
                {/* Show errors as dismissable alerts */}
                {this.props.errors.length !== 0 ? (
                  <UncontrolledAlert color="danger">
                    {this.props.errors}
                  </UncontrolledAlert>
                ) : (
                  <span></span>
                )}
                <Card className="bg-secondary shadow border-0">
                  <CardHeader className="bg-white">
                    <div className="text-muted text-center">
                      <h3>Sign in</h3>
                    </div>
                  </CardHeader>
                  <CardBody className="px-lg-5 py-lg-5">
                    <Form role="form">
                      <FormGroup className="mb-3">
                        <InputGroup
                          className="input-group-alternative"
                          style={{
                            border:
                              "1px solid " +
                              (this.state.errors["email"]
                                ? "red"
                                : "transparent"),
                          }}
                        >
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="ni ni-email-83" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            placeholder="Email"
                            name="email"
                            type="email"
                            onChange={this.handleChange}
                            value={this.state.email}
                            required
                          />
                        </InputGroup>
                        <ErrorShow>{this.state.errors["email"]}</ErrorShow>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup
                          className="input-group-alternative"
                          style={{
                            border:
                              "1px solid " +
                              (this.state.errors["password"]
                                ? "red"
                                : "transparent"),
                          }}
                        >
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="ni ni-lock-circle-open" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            placeholder="Password"
                            type="password"
                            name="password"
                            onChange={this.handleChange}
                            autoComplete="off"
                            value={this.state.password}
                            minLength={6}
                            required
                          />
                        </InputGroup>
                        <ErrorShow>{this.state.errors["password"]}</ErrorShow>
                      </FormGroup>
                      <div className="text-center">
                        <Button
                          className="mt-3"
                          color="primary"
                          type="submit"
                          onClick={this.handleSubmit}
                        >
                          Sign in
                          {loading && (
                            <>
                              <span>&nbsp;</span>
                              <Spinner
                                color="light"
                                style={{
                                  width: "1rem",
                                  height: "1rem",
                                  textAlign: "center",
                                }}
                              />
                            </>
                          )}
                        </Button>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
                <Row className="mt-3">
                  <Col xs="6">
                    {/* Component for resetting forgotten password */}
                    <ForgotPassword history={this.props.history} />
                  </Col>
                  <Col className="text-right" xs="6">
                    <a
                      className="text-light"
                      href="/register"
                      // onClick={e => e.preventDefault()}
                    >
                      {/* Redirect to register Page (Register.js) */}
                      <small>Create new account</small>
                    </a>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </section>
      </main>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.UI.loading, //UI Loading for spinner state
  errors: state.UI.errors, //Errors from redux store (errors received from the backend)
});

const mapDispatchToProps = {
  logInUser, //redux action for logging in
  clearErrors, //reset errors in store->UI
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
