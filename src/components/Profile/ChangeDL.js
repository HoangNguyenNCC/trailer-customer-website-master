// modal component to update DL

import React from "react";
// reactstrap components
import { states } from "../../constants/constants";
import { Button, Modal, Input, FormFeedback } from "reactstrap";
import ReactDatetime from "react-datetime";
import Datetime from "react-datetime";
import moment from "moment";
import Axios from "axios";

/* Props:
  reqObj : prestructured user details object 
  history : react - router
*/

class ChangeDL extends React.Component {
  state = {
    defaultModal: false,
    message: "",
    driverLicense: {},
    errors: {},
  };
  reqBody = new FormData();
  componentDidUpdate(prevProps, prevState) {
    //Set initial values from Profile props on modal open
    if (!prevState.defaultModal && this.state.defaultModal) {
      this.setState({ driverLicense: this.props.reqObj.driverLicense });
    }
  }

  toggleModal = (state) => {
    this.setState({
      [state]: !this.state[state],
    });
  };
  handleChange = (e) => {
    this.setState({
      driverLicense: {
        ...this.state.driverLicense,
        [e.target.name]: e.target.value,
      },
    });
  };
  //add image to formData
  onImageChange = (event) => {
    this.reqBody.append("driverLicenseScan", event.target.files[0]);
  };
  //simulate click of File Input button
  onScanButton = (id) => {
    const fileInput = document.getElementById("DLScan");
    fileInput.click();
  };
  // handle changes for dates (DL Expiry) YYYY - MM
  handleDateChange = (date) => {
    this.setState((prevState) => ({
      ...prevState,
      driverLicense: {
        ...prevState.driverLicense,
        expiry: moment(date).format("YYYY-MM"),
      },
    }));
  };

  handleSubmit = () => {
    const req = this.props.reqObj;
    req.driverLicense = this.state.driverLicense;
    //append object reqBody from PROFILE with the updated DL details. (Stringified for formdata)
    this.reqBody.append("reqBody", JSON.stringify(req));
    Axios.put("/user", this.reqBody).then((res) => {
      //Redirect to profile page for fetching details again on successful update
      this.setState({ message: "Updated successfully" }, () =>
        setTimeout(() => {
          this.props.history.push("/profile");
        }, 3000)
      );
    });
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
          Change Driving License
        </Button>
        <Modal
          className="modal-dialog-centered"
          isOpen={this.state.defaultModal}
          toggle={() => this.toggleModal("defaultModal")}
        >
          <div className="modal-header">
            <h6 className="modal-title" id="modal-title-default">
              Driving License Details
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
              type="text"
              value={this.state.driverLicense.card}
              required
              name="card"
              onChange={this.handleChange}
              placeholder="Card No"
            />

            <ReactDatetime
              // YYYY - MM
              inputProps={{
                placeholder: "DL Expiry",
                name: "expiry",
                required: true,
                style: {
                  border:
                    "1px solid " +
                    (this.state.errors["expiry"] ? "red" : "grey"),
                },
              }}
              onChange={(moment) => this.handleDateChange(moment)}
              value={this.state.driverLicense.expiry}
              dateFormat="YYYY-MM"
              className="my-2"
              isValidDate={(currentDate) => {
                //dates before and including today are not valid
                return currentDate.isAfter(Datetime.moment());
              }}
            />

            <Input
              placeholder="DL State : "
              required
              onChange={this.handleChange}
              type="select"
              name="state"
              value={this.state.driverLicense.state}
            >
              {/* states from a common hardcoded list of states in common.js */}
              {states.map((state, i) => (
                <option key={i}>{state}</option>
              ))}
            </Input>
            <div className="pt-4 mr-2">
              <span> DL Scan : </span>
              <a
                href={
                  this.props.reqObj.driverLicense.scan
                    ? this.props.reqObj.driverLicense.scan.data
                    : ""
                }
                rel="noopener noreferrer"
                target="_blank"
              >
                <Button
                  color="info"
                  className="align-middle mr-2"
                  size="sm"
                  type="button"
                >
                  View Scan
                </Button>
              </a>
              <Input
                type="file"
                hidden
                name="DLScan"
                id="DLScan"
                className="w-75"
                onChange={this.onImageChange}
              />
              <Button
                color="primary"
                className="align-top"
                size="sm"
                type="button"
                onClick={() => this.onScanButton("DLScan")}
              >
                Edit Scan
              </Button>
            </div>
            <FormFeedback color="info">{this.state.message}</FormFeedback>
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
export default ChangeDL;
