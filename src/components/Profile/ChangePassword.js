// modal component to update customer

import React from "react";
// reactstrap components
import { Button, Modal, Input, UncontrolledAlert } from "reactstrap";
import Axios from "axios";

/* Props: 
  history : react - router
*/
class ChangePassword extends React.Component {
  state = {
    defaultModal: false,
    oldPass: "",
    newPass: "",
    confirmNewPass: "",
    message: "",
  };

  toggleModal = (state) => {
    this.setState({
      [state]: !this.state[state],
    });
  };
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = () => {
    const { oldPass, newPass, confirmNewPass } = this.state;
    //if new passwords dont match,abort
    if (newPass !== confirmNewPass) {
      this.setState({ message: "New Passwords don't match. Try again" });
    } else if (!oldPass || !newPass) {
      //if old and new passwords dont match,abort
      this.setState({ message: "Fields empty. Try again" });
    } else {
      const reqObj = {
        oldPassword: this.state.oldPass,
        newPassword: this.state.newPass,
      };
      Axios.put("/user/password/change", reqObj)
        .then((res) => {
          this.setState({ message: "Password successfully changed" }, () =>
            setTimeout(() => {
              //Redirect to profile page after successful password change
              this.props.history.push("/profile");
            }, 3000)
          );
        })
        .catch((err) => {
          console.log(err);
          this.setState({ message: "Invalid passwords. Try again" });
        });
    }
  };
  render() {
    return (
      <React.Fragment>
        <Button
          outline
          block
          color="info"
          onClick={() => this.toggleModal("defaultModal")}
        >
          Change Password
        </Button>
        <Modal
          className="modal-dialog-centered"
          isOpen={this.state.defaultModal}
          toggle={() => this.toggleModal("defaultModal")}
        >
          <div className="modal-header">
            <h6 className="modal-title" id="modal-title-default">
              Change Password
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
          <div className="modal-body">
            <Input
              type="password"
              value={this.state.oldPass}
              name="oldPass"
              onChange={this.handleChange}
              className="py-1 my-2"
              placeholder="Old Password"
            />
            <Input
              type="password"
              value={this.state.newPass}
              name="newPass"
              onChange={this.handleChange}
              className="py-1 my-2"
              placeholder="New Password"
            />
            <Input
              type="password"
              value={this.state.confirmNewPass}
              name="confirmNewPass"
              onChange={this.handleChange}
              className="py-1 my-2"
              placeholder="Confirm New Password"
            />
            {this.state.message.length > 0 && (
              <UncontrolledAlert color="warning">
                {this.state.message}
              </UncontrolledAlert>
            )}
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
            </Button>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}
export default ChangePassword;
