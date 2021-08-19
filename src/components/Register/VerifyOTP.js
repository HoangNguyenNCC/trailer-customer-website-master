import React, { Component } from "react";
import { Modal } from "reactstrap";
import { Button, Spinner } from "reactstrap";
import { Input } from "reactstrap";
import { connect } from "react-redux";
import axios from "axios";
import { startLoading, stopLoading } from "../../redux/actions/UIActions";
import { toast } from "react-toastify";

/* Props:
  openModal=toggle to open modal
  reqObj=object having mobile, country for otp verification request
  history=router history
  from=Which page is accessing this modal (Register or Profile)
*/
class VerifyOTP extends Component {
  state = {
    isOpen: false,
    otp: "",
  };

  resendOTP = () => {
    // store.dispatch({type:LOADING_UI})
    this.props.startLoading();
    axios
      .post("/signup/otp/resend", this.props.reqObj)
      .then((res) => {
        toast.info("🏁 OTP resent successfully!");
        this.props.stopLoading();
      })
      .catch((err) => {
        console.log(err);
        this.props.stopLoading();
      });
  };
  componentDidUpdate(prevProps) {
    if (
      this.props.openModal !== false &&
      prevProps.openModal !== this.props.openModal
    ) {
      this.setState({ isOpen: this.props.openModal });
      if (this.props.from === "profile") {
        this.resendOTP();
      }
    }
  }
  submitOTP = () => {
    const body = {
      ...this.props.reqObj,
      otp: this.state.otp,
    };
    this.props.startLoading();
    axios
      .post("/signup/verify", body)
      .then((res) => {
        this.props.stopLoading();
        toast.success("OTP verified successfully!");
        //If verify otp as been called from the register page, redirect back to login on success.
        if (this.props.from === "register") {
          this.props.history.push("/login");
        } else {
          this.toggleModal(false);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("❌Check OTP!");
        this.props.stopLoading();
      });
  };

  //Toggle modal visibility
  toggleModal = (val) => {
    if (val === false) {
      if (this.props.from === "register") {
        this.props.history.push("/login");
      } else {
        this.props.onClose();
      }
    }
    this.setState({ isOpen: val });
  };

  handleChange = (event) => {
    this.setState({
      otp: event.target.value,
    });
  };
  render() {
    const { isOpen } = this.state;
    const { loading } = this.props;
    // this.toggleModal(this.props.openModal)
    return (
      <Modal className="modal-dialog-centered" isOpen={isOpen} backdrop="false">
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">
            Verify OTP
          </h5>
          <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={() => this.toggleModal(false)}
          >
            <span aria-hidden={true}>×</span>
          </button>
        </div>
        <div className="modal-body">
          <div className="my-4 text-center">
            OTP sent on : {this.props.reqObj.mobile}
          </div>
          <Input
            value={this.state.otp}
            onChange={this.handleChange}
            className="text-center"
          />
          <div onClick={this.resendOTP} className="my-2 text-center text-info">
            Resend OTP
          </div>
        </div>
        <div className="modal-footer">
          <Button
            color="secondary"
            data-dismiss="modal"
            type="button"
            onClick={() => this.toggleModal(false)}
          >
            Close
          </Button>
          <Button color="primary" type="button" onClick={this.submitOTP}>
            Verify OTP
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
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.UI.loading, //loading value from store -> UI
});

const mapDispatchToProps = {
  startLoading,
  stopLoading,
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyOTP);
