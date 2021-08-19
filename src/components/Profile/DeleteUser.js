// modal component to delete customer

import React, { Component, Fragment } from "react";
import { Button, Modal } from "reactstrap";
import Axios from "axios";
import { logOutUser } from "../../redux/actions/userActions";
import { connect } from "react-redux";

/* Props:
  email : email of logged in user 
  logOutUser() - redux action  to log out user
*/
class DeleteUser extends Component {
  state = {
    deleteModal: false,
    message: "OK, Delete My Account",
  };

  toggleModal = () => {
    this.setState({ deleteModal: !this.state.deleteModal });
  };

  handleSubmit = () => {
    Axios.delete(`/user/${this.props.email}`)
      .then((res) => {
        //User deleted successfully, redirect to login.
        this.setState({ message: "Account Deleted Successfully." }, () =>
          setTimeout(() => {
            this.props.logOutUser();
          }, 3000)
        );
      })
      .catch((err) => console.log(err));
  };

  render() {
    return (
      <div>
        <Button
          size="sm"
          className="mb-3"
          color="warning"
          type="button"
          onClick={() => this.toggleModal("deleteModal")}
        >
          Delete Account
        </Button>
        <Modal
          className="modal-dialog-centered modal-danger"
          contentClassName="bg-gradient-danger"
          isOpen={this.state.deleteModal}
          toggle={() => this.toggleModal("deleteModal")}
          backdrop="false"
        >
          <div className="modal-header">
            <h6 className="modal-title" id="modal-title-notification">
              Your attention is required
            </h6>
            <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={() => this.toggleModal("deleteModal")}
            >
              <span aria-hidden={true}>×</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="py-3 text-center">
              <i className="ni ni-bell-55 ni-3x" />
              <h4 className="heading mt-4">Delete Account</h4>
              <p>
                You won't be able to recover your account data if you wish to
                proceed.
              </p>
              <p>This is PERMANENT.</p>
            </div>
          </div>
          <div className="modal-footer">
            {this.state.message === "OK, Delete My Account" ? (
              <Fragment>
                <Button
                  className="btn-white"
                  color="default"
                  type="button"
                  onClick={this.handleSubmit}
                >
                  {this.state.message}
                </Button>
                <Button
                  className="btn-white ml-auto"
                  color="default"
                  data-dismiss="modal"
                  type="button"
                  onClick={() => this.toggleModal("deleteModal")}
                >
                  Close
                </Button>
              </Fragment>
            ) : (
              <Button color="success" type="button" block>
                {this.state.message}
              </Button>
            )}
          </div>
        </Modal>
      </div>
    );
  }
}

const mapDispatchToProps = {
  logOutUser,
};

export default connect(null, mapDispatchToProps)(DeleteUser);
