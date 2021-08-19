import React from "react";
// reactstrap components
import { Button, Modal, Form, Input, Spinner } from "reactstrap";
import { toast } from "react-toastify";
import Axios from "axios";

/* Props:
  history : History object of react-router
  filtercount : Count of selected filters (Redux store -> data)
*/
class ForgotPassword extends React.Component {
  state = {
    step: 1, //Step of the forgot password flow
    email: "",
    defaultModal: false,
    token: "",
    newPassword: "",
  };

  toggleModal = (state) => {
    if (this.state.defaultModal) {
      //reset state to initial so that it starts off new when reopened
      this.setState({
        step: 1,
        [state]: !this.state[state],
        error: "",
      });
    } else {
      this.setState({
        [state]: !this.state[state],
      });
    }
  };
  handleChange = (e) => {
    //handle input value change
    this.setState({ [e.target.name]: e.target.value });
  };

  handleResetPassword = async () => {
    await this.setState({ loading: true }); //set loading : true for loading spinners

    //STEP 2: Route - /resetpassword
    //        REQ BODY : token : from customer's email (input by customer)
    //                   password : new password entered by user
    Axios.put("/resetpassword", {
      token: this.state.token,
      password: this.state.newPassword,
    })
      .then((res) => {
        toast.success("Password Changed Successfully", {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          this.props.history.push("/login");
        }, 1500);
      })
      .catch((err) => {
        this.setState({ error: "Error. Check and try again?", loading: false });
      });
  };

  handleSubmit = async () => {
    await this.setState({ loading: true });
    //STEP 1: Route - /forgotpassword
    //        REQ BODY : email : customer's email (input by customer)
    //                   platform : web
    Axios.put("/forgotpassword", {
      email: this.state.email,
      platform: "web",
    })
      .then((res) => {
        this.setState({
          step: 2, //show step 2 if mail sent successfully
          loading: false,
          error: "Link sent! Please check your mail for the token.",
        });
      })
      .catch((err) => {
        this.setState({
          loading: false,
          error: "Email not found. Try another?",
        });
      });
  };
  render() {
    const { step, loading } = this.state;
    let forgotComponent;
    if (step === 1) {
      //Form for the first step in the forgot password flow : Get user's email
      forgotComponent = (
        <Form onSubmit={this.handleSubmit}>
          <div className="modal-body">
            <div className="pl-1 my-2 text-muted">
              Enter the email registered with your account :{" "}
            </div>
            <Input
              type="email"
              required
              value={this.state.email}
              name="email"
              placeholder="Email"
              onChange={this.handleChange}
            />
            <div className="text-center">{this.state.error}</div>
          </div>
          <div className="modal-footer">
            <Button
              className="ml-auto"
              color="link"
              data-dismiss="modal"
              type="button"
              onClick={() => this.toggleModal("defaultModal")}
            >
              Close
            </Button>
            <Button color="primary" onClick={this.handleSubmit}>
              Submit
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
      );
    } else {
      forgotComponent = (
        //Form for the second step in the forgot password flow : Get user's token and new password
        <Form onSubmit={this.handleResetPassword}>
          <div className="modal-body">
            <Input
              type="text"
              required
              value={this.state.token}
              name="token"
              placeholder="Token received on email"
              className="my-2"
              onChange={this.handleChange}
            />
            <Input
              type="password"
              required
              value={this.state.newPassword}
              name="newPassword"
              placeholder="New Password"
              className="my-2"
              onChange={this.handleChange}
            />
            <div className="text-center">{this.state.error}</div>
          </div>
          <div className="modal-footer">
            <Button
              className="ml-auto"
              color="link"
              data-dismiss="modal"
              type="button"
              onClick={() => this.toggleModal("defaultModal")}
            >
              Close
            </Button>
            <Button color="primary" onClick={this.handleResetPassword}>
              Submit
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
      );
    }
    return (
      <React.Fragment>
        <div
          className="text-light small"
          onClick={() => this.toggleModal("defaultModal")}
        >
          Forgot password ?
        </div>
        <Modal
          className="modal-dialog-centered"
          isOpen={this.state.defaultModal}
          toggle={() => this.toggleModal("defaultModal")}
        >
          <div className="modal-header">
            <h6 className="modal-title" id="modal-title-default">
              Reset Password
            </h6>
            <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={() => this.toggleModal("defaultModal")}
            >
              <span aria-hidden={true}>×</span>
            </button>
          </div>
          {forgotComponent}
        </Modal>
      </React.Fragment>
    );
  }
}
export default ForgotPassword;
