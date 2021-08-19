/*!

=========================================================
* Argon Design System React - v1.1.0
=========================================================
// 

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import Radium, { StyleRoot } from "radium";

// reactstrap components
import { Button, Input, Card, Container, Row, Col, Spinner } from "reactstrap";
import { connect } from "react-redux";
import ReactDatetime from "react-datetime";
import { getProfile } from "../../redux/actions/userActions";
import moment from "moment";
import VerifyOTP from "../Register/VerifyOTP";
import ChangeDL from "./ChangeDL";
import ChangeAddress from "./ChangeAddress";
import DeleteUser from "./DeleteUser";
import Axios from "axios";
import ChangePassword from "./ChangePassword";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { startLoading, stopLoading } from "../../redux/actions/UIActions";

//Styles object for inline styling
const styles = {
  profileRow: {
    // display:"flex",
    // justifyContent:"space-between"
    fontSize: "0.9em",
    marginBottom: "2em",
  },
  // verifyButton: {
  //   marginTop: "3em",
  // },
  editableInput: {
    textAlign: "right",
    fontWeight: "bolder",
    padding: "0.5em",
    color: "#525f7f",
    borderTop: "none",
    borderLeft: "none",
    borderRight: "none",
    borderBottom: "none",
    ":hover": {
      borderBottom: "0.3px solid grey",
    },
  },
  mobileRow: {
    padding: "2em 0 1em 0",
    margin: "2em 0 1em 0",
    "@media only screen and (maxWidth: 600px)": {
      //   padding: "2em 0 0 5em",
      fontSize: "0.6rem",
    },
  },
  viewBtn: {
    "@media only screen and (maxWidth: 600px)": {
      fontSize: "0.4rem",
      verticalAlign: "middle",
    },
  },
};

/* Props: (All redux)
  user : user object from store 
  loading : UI loading state from store
  startLoading() and stopLoading() : toggle UI loading in store
  getProfile() : redux action to get user object from backend
*/

class Profile extends React.Component {
  async componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;
    console.log("Profile Mounts");
    //Set loading to true for spinners
    this.props.startLoading();
    //Fetch profile details from the backend
    const x = await this.props.getProfile();
    console.log(x);
    this.reqObj = {
      name: this.props.user.name,
      email: this.props.user.email,
      dob: this.props.user.dob,
      mobile: this.props.user.mobile,
      address: this.props.user.address,
      driverLicense: {
        expiry: this.props.user.driverLicense.expiry,
        card: this.props.user.driverLicense.card,
        scan: this.props.user.driverLicense.scan,
      },
    };
    await this.setState({ user: this.props.user });
    this.props.stopLoading();
  }
  constructor(props) {
    super(props);
    this.reqBody = new FormData();
    // this.reqObj = {
    //   name: this.props.user.name,
    //   email: this.props.user.email,
    //   dob: this.props.user.dob,
    //   mobile: this.props.user.mobile,
    //   address: this.props.user.address,
    //   driverLicense: {
    //     expiry: this.props.user.driverLicense.expiry,
    //     card: this.props.user.driverLicense.card,
    //     scan: this.props.user.driverLicense.scan,
    //   },
    // };
  }
  state = {
    otpDialog: false,
  };

  resendEmail = () => {
    // Request to send a verification email to the customer -- Body -- email : email of customer
    Axios.post("/customer/email/verify", { email: this.reqObj.email })
      .then(() => {
        toast.success("Verification link sent to your registered email!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
        });
      })
      .catch(() => {
        toast.warn("Email verification failed. Try later?", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
        });
      });
  };
  //Add new image file to formdata
  onImageChange = (event) => {
    this.reqBody.append("photo", event.target.files[0]);
  };
  //Simulate click of file input button
  onScanButton = (id) => {
    const fileInput = document.getElementById("userPhoto");
    fileInput.click();
  };

  onDialogClose = async () => {
    await this.props.getProfile();
    this.setState({ user: this.props.user, otpDialog: false });
  };
  modalObj = {};

  handleDateChange = (date, name) => {
    this.setState({
      user: { ...this.state.user, dob: moment(date).format("YYYY-MM-DD") },
    });
  };

  handleChange = (e) => {
    this.setState({
      user: {
        ...this.state.user,
        [e.target.name]: e.target.value,
      },
    });
  };

  handleSubmit = () => {
    const updateObj = {
      name: this.state.user.name,
      mobile: this.state.user.mobile,
      dob: this.state.user.dob,
      address: this.state.user.address,
      driverLicense: {
        expiry: this.state.user.driverLicense.expiry,
        card: this.state.user.driverLicense.card,
        scan: this.state.user.driverLicense.scan.data,
      },
    };
    // Append object reqBody to formdata object
    this.reqBody.append("reqBody", JSON.stringify(updateObj));
    //Update profile
    Axios.put("/user", this.reqBody).then((res) => {
      this.setState({ message: "Updated successfully" }, () =>
        setTimeout(() => {
          this.props.history.push("/profile");
        }, 3000)
      );
    });
  };

  render() {
    const { user } = this.props;

    return (
      <StyleRoot>
        <main className="profile-page" ref="main">
          <VerifyOTP
            openModal={this.state.otpDialog}
            reqObj={this.modalObj}
            from="profile"
            onClose={this.onDialogClose}
          />
          <section className="section-profile-cover section-shaped my-0">
            {/* Circles background */}
            <div className="shape shape-style-1 shape-default alpha-4">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            {/* SVG separator */}
            <div className="separator separator-bottom separator-skew">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                version="1.1"
                viewBox="0 0 2560 100"
                x="0"
                y="0"
              >
                <polygon
                  className="fill-white"
                  points="2560 0 2560 100 0 100"
                />
              </svg>
            </div>
          </section>
          <section className="section">
            {this.state.user ? (
              <Container>
                <Card className="card-profile shadow mt--300">
                  <div className="px-4">
                    <Row className="justify-content-center">
                      <Col className="order-lg-2" lg="3">
                        <div className="card-profile-image">
                          <a
                            href="/profile"
                            onClick={(e) => e.preventDefault()}
                          >
                            <img
                              alt="..."
                              src={user.photo}
                              style={{
                                // maxHeight: "150px",
                                // maxWidth: "150px",
                                width: "150px",
                                height: "150px",
                                // borderRadius:"20%",
                                backgroundColor: "white",
                              }}
                            />
                          </a>
                        </div>
                      </Col>
                      <Col
                        className="order-lg-3 text-lg-center align-self-lg-center"
                        lg="4"
                      >
                        <div className="card-profile-actions pt-5 mt-lg-0">
                          <DeleteUser email={this.props.user.email} />
                        </div>
                      </Col>

                      <Col className="order-lg-1" lg="4">
                        <div className="card-profile-actions pt-5 d-flex justify-content-center">
                          {!this.state.user.isMobileVerified && (
                            <Button
                              className="mr-4"
                              color="info"
                              href="#pablo"
                              style={styles.verifyButton}
                              key="vMob"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                this.modalObj = {
                                  mobile: this.props.user.mobile,
                                  country: this.props.user.address.country,
                                  testMode: false,
                                };
                                this.setState({ otpDialog: true });
                              }}
                            >
                              Verify Mobile
                            </Button>
                          )}
                          {!this.state.user.isEmailVerified && (
                            <Button
                              className="float-right"
                              color="default"
                              size="sm"
                              key="vBtn"
                              style={styles.verifyButton}
                              onClick={this.resendEmail}
                            >
                              Verify Email
                            </Button>
                          )}
                        </div>
                      </Col>
                    </Row>
                    <div
                      className="text-center mt-3"
                      // style={{
                      //   marginTop: "80px",
                      // }}
                    >
                      <h3>{user.name}</h3>
                    </div>
                    <div
                      className="border-top"
                      key="coverDiv"
                      style={styles.mobileRow}
                    >
                      <Row
                        className="justify-content-center"
                        style={styles.profileRow}
                      >
                        <Col>
                          <span>Name :</span>
                        </Col>
                        <Col className="text-right">
                          <input
                            type="text"
                            style={styles.editableInput}
                            key="name"
                            name="name"
                            onChange={this.handleChange}
                            value={this.state.user.name}
                          />
                        </Col>
                      </Row>
                      <Row
                        className="justify-content-center"
                        style={styles.profileRow}
                      >
                        <Col>
                          <span>Mobile :</span>
                        </Col>
                        <Col className="text-right">
                          <input
                            type="text"
                            style={styles.editableInput}
                            key="mob"
                            name="mobile"
                            onChange={this.handleChange}
                            value={this.state.user.mobile}
                          />
                          {/* <strong >+91 9879202825</strong> */}
                        </Col>
                      </Row>
                      <Row
                        className="justify-content-center"
                        style={styles.profileRow}
                      >
                        <Col>
                          <span>Date Of Birth :</span>
                        </Col>
                        <Col className="text-right">
                          <ReactDatetime
                            inputProps={{
                              placeholder: "Date Of Birth",
                              name: "dob",
                              required: true,
                              style: styles.editableInput,
                            }}
                            value={moment(this.state.user.dob).format(
                              "YYYY-MM-DD"
                            )}
                            timeFormat={false}
                            onChange={(moment) =>
                              this.handleDateChange(moment, "dob")
                            }
                          />
                          {/* <strong >18/02/1987</strong> */}
                        </Col>
                      </Row>

                      <Row
                        xs="2"
                        className="justify-content-center pb-3"
                        style={styles.profileRow}
                      >
                        <Col xs="3">
                          <span>Photo :</span>
                        </Col>
                        <Col className="text-right" xs="9">
                          <a
                            href={user.photo}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            <Button
                              color="info"
                              className="align-middle mr-1"
                              size="sm"
                              style={styles.viewBtn}
                              type="button"
                            >
                              View Photo
                            </Button>
                          </a>
                          <Input
                            type="file"
                            hidden
                            name="userPhoto"
                            id="userPhoto"
                            // className="w-75"
                            onChange={this.onImageChange}
                          />
                          <Button
                            color="primary"
                            className="align-top"
                            size="sm"
                            type="button"
                            onClick={() => this.onScanButton("userPhoto")}
                          >
                            Change Photo
                          </Button>
                        </Col>
                      </Row>
                      <Button
                        block
                        color="warning"
                        className="align-middle py-2 my-3"
                        size="lg"
                        style={styles.viewBtn}
                        type="button"
                        onClick={this.handleSubmit}
                      >
                        Update Profile
                      </Button>
                      <Row>
                        <Col>
                          <ChangeAddress
                            reqObj={this.reqObj}
                            history={this.props.history}
                          />
                        </Col>
                        <Col>
                          <ChangeDL
                            reqObj={this.reqObj}
                            history={this.props.history}
                          />
                        </Col>
                        <Col>
                          <ChangePassword history={this.props.history} />
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Card>
              </Container>
            ) : (
              <Spinner />
            )}
          </section>
        </main>
      </StyleRoot>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.UI.loading,
  user: state.user.user,
});

const mapDispatchToProps = {
  getProfile,
  startLoading,
  stopLoading,
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(Profile));
