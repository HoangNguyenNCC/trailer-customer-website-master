//in handleSubmit, manual check for photos and then show error of required
/* global google*/
import React, { Component, Fragment } from "react";
import "./Register.css";
import moment from "moment";
import Datetime from "react-datetime";
import { states } from "../../constants/constants";
import ErrorShow from "../Validation/ErrorShow/ErrorShow";
import { toast } from "react-toastify";
import { startLoading, stopLoading } from "../../redux/actions/UIActions";
import {
  Button,
  Card,
  Spinner,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroup,
  Container,
  Row,
  Col,
  FormText,
  UncontrolledAlert,
} from "reactstrap";

import errorPopulator from "../Validation/errorPopulator/errorPopulator";
import VerifyOTP from "./VerifyOTP";

import ReactDatetime from "react-datetime";
import Axios from "axios";
import { connect } from "react-redux";

/* Props:
  history : react - router
*/
class Register extends Component {
  constructor(props) {
    super(props);
    this.autocomplete = null;
    this.formData = new FormData();
  }
  componentDidMount() {
    //Load Places API on Component Mount
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("autocomplete"),
      {}
    );

    this.autocomplete.addListener("place_changed", this.handlePlaceSelect);
  }

  //Default registration object
  state = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    mobile: "",
    address: {},
    houseNo: "",
    driverLicense: {
      card: "",
      state: "New South Wales",
      expiry: "",
    },
    otp: false,
    errors: {},
    backError: "",
    DLText: "Required",
    photoText: "Required",
  };
  // Handle all changes on date input fields
  handleDateChange = (date, name) => {
    if (name === "expiry") {
      const errors = errorPopulator(
        this.state,
        "expiry",
        moment(date).format("YYYY-MM")
      );
      this.setState((prevState) => ({
        ...prevState,
        driverLicense: {
          ...prevState.driverLicense,
          expiry: moment(date).format("YYYY-MM"),
        },
        errors,
      }));
    } else {
      const errors = errorPopulator(
        this.state,
        "dob",
        moment(date).format("YYYY-MM-DD")
      );
      this.setState({ dob: moment(date).format("YYYY-MM-DD"), errors });
    }
  };

  handlePlaceSelect = () => {
    // console.log(this.autocomplete.getPlace().geometry.location.toJSON())
    const mapsObj = this.autocomplete.getPlace(); //inbuilt function to get entire addres object from the Places API
    const len = mapsObj.address_components.length;
    //check if the address does contain a pincode field, else ask for more precision
    if (mapsObj.address_components[len - 1].types.includes("postal_code")) {
      const addressObj = {
        text: this.state.houseNo + "," + mapsObj.formatted_address,
        country: mapsObj.address_components[len - 2].long_name,
        state: mapsObj.address_components[len - 3].long_name,
        pincode: mapsObj.address_components[len - 1].long_name,
        coordinates: Object.values(mapsObj.geometry.location.toJSON()),
      };
      this.setState({ address: addressObj, addressError: "" });
    } else {
      this.setState({
        addressError: "Please be a bit more precise with the location.",
      });
    }
  };

  handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    if (event.target.name === "card" || event.target.name === "state") {
      this.setState({
        driverLicense: {
          ...this.state.driverLicense,
          [event.target.name]: event.target.value,
        },
      });
    } else {
      this.setState({
        [event.target.name]: event.target.value,
      });
    }
    //Find and populate errors from state values
    const errors = errorPopulator(this.state, name, value);
    this.setState({
      errors: errors,
    });
  };
  modalObj = {};
  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state.errors);
    if (Object.keys(this.state.errors).length !== 0) {
      console.log(this.state.errors);
      //Scroll top top to show errors if any
      window.scrollTo(0, 0);
      return;
    }
    if (this.state.addressError.length !== 0) {
      window.scrollTo(0, 0);
      return;
    }
    const formData = new FormData();
    const reqBody = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      dob: this.state.dob,
      mobile: this.state.mobile,
      address: this.state.address,
      driverLicense: this.state.driverLicense,
    };
    //append object reqBody from PROFILE with the updated address. (Stringified for formdata)

    formData.append("reqBody", JSON.stringify(reqBody));
    formData.append("photo", this.state.photo);
    formData.append("driverLicenseScan", this.state.DLScan);
    console.log(reqBody);
    this.props.startLoading();
    Axios.post("/signup", formData)
      .then((res) => {
        console.log(res);
        // On successful signup, show modal to verify OTP sent on mobile. Object passed to VerifyOTP has mobile and country of user
        this.modalObj = {
          mobile: this.state.mobile,
          country: this.state.address.country,
          testMode: true,
        };
        this.props.stopLoading();
        this.setState({
          otp: true,
          backError: "",
        });
        toast.success("👍 User registered!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch((err) => {
        this.props.stopLoading();
        window.scrollTo(0, 0);
        this.setState({ backError: err.response.data.message });
      });
  };

  onImageChange = (event) => {
    //Set image files in state
    if (event.target.name === "DLScan") {
      this.setState(
        {
          [event.target.name]: event.target.files[0],
          DLText: event.target.files[0].name,
        },
        () => {
          console.log("File received");
        }
      );
    }
    if (event.target.name === "photo") {
      this.setState(
        {
          [event.target.name]: event.target.files[0],
          photoText: event.target.files[0].name,
        },
        () => {
          console.log("File received");
        }
      );
    }
  };

  onScanButton = (id) => {
    //Simulate respective file input clicks
    if (id === "DLScan") {
      const fileInput = document.getElementById("DLScan");
      fileInput.click();
    } else {
      const fileInput = document.getElementById("photo");
      fileInput.click();
    }
  };
  render() {
    const { loading } = this.props;
    return (
      <Fragment>
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
            <VerifyOTP
              openModal={this.state.otp}
              reqObj={this.modalObj}
              history={this.props.history}
              from="register"
            />
            <Container className="pt-lg-5">
              <Row className="justify-content-center">
                <Col lg="6">
                  {this.state.backError.length !== 0 ? (
                    <UncontrolledAlert color="danger">
                      {this.state.backError}
                    </UncontrolledAlert>
                  ) : (
                    <span></span>
                  )}
                  <Card className="bg-secondary shadow border-0">
                    <CardHeader className="bg-white">
                      <div className="text-muted text-center">
                        <h5>Register</h5>
                      </div>
                    </CardHeader>
                    <CardBody className="px-lg-5 py-lg-5">
                      <Form
                        role="form"
                        id="register"
                        onSubmit={this.handleSubmit}
                      >
                        <FormGroup className="mb-3">
                          <InputGroup
                            className="input-group-alternative"
                            style={{
                              border:
                                "1px solid " +
                                (this.state.errors["name"]
                                  ? "red"
                                  : "transparent"),
                            }}
                          >
                            <Input
                              placeholder="Name"
                              required
                              onChange={this.handleChange}
                              name="name"
                              type="text"
                              value={this.state.name}
                            />
                          </InputGroup>
                          <ErrorShow>{this.state.errors["name"]}</ErrorShow>
                        </FormGroup>
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
                            <Input
                              placeholder="Email"
                              required
                              onChange={this.handleChange}
                              name="email"
                              type="email"
                              value={this.state.email}
                            />
                          </InputGroup>
                          <ErrorShow>{this.state.errors["email"]}</ErrorShow>
                        </FormGroup>
                        <FormGroup className="mb-3">
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
                            <Input
                              placeholder="Password"
                              type="password"
                              autoComplete="off"
                              name="password"
                              required
                              onChange={this.handleChange}
                              value={this.state.password}
                            />
                          </InputGroup>
                          <ErrorShow>{this.state.errors["password"]}</ErrorShow>
                        </FormGroup>
                        <FormGroup className="mb-3">
                          <InputGroup
                            className="input-group-alternative"
                            style={{
                              border:
                                "1px solid " +
                                (this.state.errors["confirmPassword"]
                                  ? "red"
                                  : "transparent"),
                            }}
                          >
                            <Input
                              placeholder="Confirm Password"
                              type="password"
                              required
                              name="confirmPassword"
                              autoComplete="off"
                              onChange={this.handleChange}
                              value={this.state.confirmPassword}
                            />
                          </InputGroup>
                          <ErrorShow>
                            {this.state.errors["confirmPassword"]}
                          </ErrorShow>
                        </FormGroup>
                        <FormGroup className="mb-3">
                          <ReactDatetime
                            inputProps={{
                              placeholder: "Date Of Birth",
                              name: "dob",
                              value: this.state.dob,
                              required: true,
                              onClick: this.handleChange,
                              // style: {
                              //   border:
                              //     "1px solid " +
                              //     (this.state.errors["dob"]
                              //       ? "red"
                              //       : "transparent"),
                              // },
                            }}
                            isValidDate={(currentDate) => {
                              //dates after and including today are not valid
                              return currentDate.isBefore(Datetime.moment());
                            }}
                            value={this.state.dob}
                            timeFormat={false}
                            onChange={(moment) =>
                              this.handleDateChange(moment, "dob")
                            }
                          />
                          <ErrorShow>{this.state.errors["dob"]}</ErrorShow>
                        </FormGroup>
                        <FormGroup className="mb-3">
                          <InputGroup className="input-group-alternative">
                            <Input
                              placeholder="Mobile (Please use country code)"
                              onChange={this.handleChange}
                              required
                              type="text"
                              name="mobile"
                              value={this.state.mobile}
                              style={{
                                border:
                                  "1px solid " +
                                  (this.state.errors["mobile"]
                                    ? "red"
                                    : "transparent"),
                              }}
                            />
                          </InputGroup>
                          <ErrorShow>{this.state.errors.mobile}</ErrorShow>
                        </FormGroup>
                        <FormGroup className="mb-3">
                          <InputGroup className="input-group-alternative">
                            <Input
                              placeholder="House No."
                              onChange={this.handleChange}
                              required
                              type="text"
                              name="houseNo"
                              value={this.state.address.houseNo}
                              style={{
                                border:
                                  "1px solid " +
                                  (this.state.errors["houseNo"]
                                    ? "red"
                                    : "transparent"),
                              }}
                            />
                          </InputGroup>
                          <ErrorShow>{this.state.errors.houseNo}</ErrorShow>
                        </FormGroup>
                        <FormGroup className="mb-3">
                          <InputGroup
                            className="input-group-alternative"
                            style={{
                              border:
                                "1px solid " +
                                (this.state.errors["address"]
                                  ? "red"
                                  : "transparent"),
                            }}
                          >
                            <Input
                              placeholder="Address"
                              id="autocomplete"
                              required
                              ref="input"
                              onChange={this.handleChange}
                              type="text"
                              name="address"
                            />
                          </InputGroup>
                          <ErrorShow>{this.state.addressError}</ErrorShow>
                        </FormGroup>
                        <div className="mb-3 border-top border-light pt-3">
                          Driver License :
                        </div>
                        <FormGroup>
                          <FormText className="d-inline mr-2">
                            DL Scan :
                          </FormText>
                          <Input
                            type="file"
                            hidden
                            name="DLScan"
                            id="DLScan"
                            className="w-75"
                            onChange={this.onImageChange}
                          />
                          <Button
                            size="sm"
                            color="primary"
                            onClick={() => this.onScanButton("DLScan")}
                          >
                            Choose File
                          </Button>
                          <span className="text-muted small">
                            {this.state.DLText.substring(0, 20) + "..."}
                          </span>
                          <ErrorShow>{this.state.dlError}</ErrorShow>
                        </FormGroup>
                        <FormGroup className="mb-3">
                          <InputGroup
                            className="input-group-alternative"
                            style={{
                              border:
                                "1px solid " +
                                (this.state.errors["card"]
                                  ? "red"
                                  : "transparent"),
                            }}
                          >
                            <Input
                              placeholder="DL No : "
                              required
                              onChange={this.handleChange}
                              type="text"
                              name="card"
                              value={this.state.driverLicense.card}
                            />
                          </InputGroup>
                          <ErrorShow>{this.state.errors.card}</ErrorShow>
                        </FormGroup>
                        <FormGroup className="mb-3">
                          <InputGroup className="input-group-alternative">
                            <Input
                              placeholder="DL State : "
                              required
                              onChange={this.handleChange}
                              type="select"
                              name="state"
                              value={this.state.driverLicense.state}
                            >
                              {states.map((state) => (
                                <option>{state}</option>
                              ))}
                            </Input>
                          </InputGroup>
                        </FormGroup>
                        <FormGroup className="mb-3 border-bottom border-light pb-3">
                          <ReactDatetime
                            inputProps={{
                              placeholder: "DL Expiry",
                              name: "expiry",
                              required: true,
                              style: {
                                border:
                                  "1px solid " +
                                  (this.state.errors["expiry"]
                                    ? "red"
                                    : "transparent"),
                              },
                            }}
                            onChange={(moment) =>
                              this.handleDateChange(moment, "expiry")
                            }
                            value={this.state.driverLicense.expiry}
                            dateFormat="MM/YYYY"
                            isValidDate={(currentDate) => {
                              //dates before and including today are not valid
                              return currentDate.isAfter(Datetime.moment());
                            }}
                          />
                        </FormGroup>
                        <FormGroup>
                          <span className="d-inline mr-2">Photo :</span>
                          <Input
                            type="file"
                            accept="image/png, image/jpeg"
                            hidden
                            name="photo"
                            id="photo"
                            className="w-75"
                            onChange={this.onImageChange}
                          />
                          <Button
                            size="sm"
                            color="primary"
                            onClick={() => this.onScanButton("photoScan")}
                          >
                            Choose File
                          </Button>
                          <span className="text-muted small">
                            {this.state.photoText.substring(0, 20) + "..."}
                          </span>
                          <ErrorShow>{this.state.photoError}</ErrorShow>
                        </FormGroup>

                        <div className="text-center">
                          <Button
                            className="mt-3"
                            color="primary"
                            type="submit"
                            // onClick={this.handleSubmit}
                          >
                            Sign up
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
                        {/* <div className="text-center">
                          <Button
                            className="mt-3"
                            color="primary"
                            type="submit"
                            // onClick={this.handleSubmit}
                          >
                            Sign Up
                          </Button>
                        </div> */}
                      </Form>
                    </CardBody>
                  </Card>
                  <Row className="mt-3">
                    <Col xs="8">
                      <a
                        className="text-light"
                        href="/login"
                        // onClick={e => e.preventDefault()}
                      >
                        <small>Already have an account? Log in!</small>
                      </a>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Container>
          </section>
        </main>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.UI.loading,
});

const mapDispatchToProps = {
  stopLoading,
  startLoading,
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
