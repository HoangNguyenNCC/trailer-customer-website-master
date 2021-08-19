//Modal component for handling booking cancellation by user.

import React, { Component, Fragment } from "react";
import { Button, Modal } from "reactstrap";
import Axios from "axios";
import { toast } from "react-toastify";

/* Props:
  rentalId : id of the booking
  history : the history object from React Router
*/

export default class RequestCancellation extends Component {
  state = {
    cancelModal: false,
    message: "OK, Cancel this booking",
  };

  //function to toggle visibility of modal

  toggleModal = () => {
    this.setState({ cancelModal: !this.state.cancelModal });
  };

  //function to handle form submission
  // Route used : /rental/cancel
  //Body : rentalId : id of the rental/booking

  handleSubmit = () => {
    const reqObj = {
      rentalId: this.props.rentalId,
      bookingId: this.props.rentalId,
      type: "cancellation",
    };
    Axios.post(`/rental/edit`, reqObj)
      .then((res) => {
        //Redirect to the booking page again once success is returned so that updated booking details are fetched again
        this.setState({ message: "Cancellation requested" }, () =>
          setTimeout(() => {
            this.props.history.push(`/booking/${reqObj.rentalId}`);
          }, 2000)
        );
        toast.success("🙌 Cancellation requested successfully.", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch((err) => {
        console.log(err);
        toast.error("❌ Cancellation request failed.", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  render() {
    return (
      <div>
        <Button
          size="sm"
          color="danger"
          onClick={() => this.toggleModal("cancelModal")}
        >
          Request Cancellation
        </Button>
        <Modal
          className="modal-dialog-centered modal-danger"
          contentClassName="bg-gradient-danger"
          isOpen={this.state.cancelModal}
          toggle={() => this.toggleModal("cancelModal")}
          backdrop={false}
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
              onClick={() => this.toggleModal("cancelModal")}
            >
              <span aria-hidden={true}>×</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="py-3 text-center">
              <i className="ni ni-bell-55 ni-3x" />
              <h4 className="heading mt-4">Cancel Booking</h4>
              <p>
                You won't be able to make changes to the booking once this is
                accepted.
              </p>
            </div>
          </div>
          <div className="modal-footer">
            {this.state.message === "OK, Cancel this booking" ? (
              <Fragment>
                <Button
                  className="btn-white"
                  color="default"
                  type="button"
                  onClick={this.handleSubmit}
                >
                  {this.state.message}
                </Button>
                {/* Button to close Modal */}
                <Button
                  className="btn-white ml-auto"
                  color="default"
                  data-dismiss="modal"
                  type="button"
                  onClick={() => this.toggleModal("cancelModal")}
                >
                  Close
                </Button>
              </Fragment>
            ) : (
              // Button to submmit cancellation request
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
