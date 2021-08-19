// modal component to update address

import React from "react";
// reactstrap components
import { Button, Modal, Input, Form, FormFeedback } from "reactstrap";
import "./ChangeAddress.css";
import Axios from "axios";
/*global google*/

/* Props:
  reqObj : prestructured user details object 
  history : react - router
*/
class ChangeAddress extends React.Component {
  state = {
    defaultModal: false,
    houseNo: "",
    message: "",
  };
  constructor(props) {
    super(props);
    this.autocomplete = null;
  }

  toggleModal = (state) => {
    if (!this.state.defaultModal) {
      //initialize Places API functions when modal opens
      this.setState(
        {
          [state]: !this.state[state],
        },
        () => {
          setTimeout(() => {
            this.autocomplete = new google.maps.places.Autocomplete(
              document.getElementById("autocomplete"),
              {}
            );

            this.autocomplete.addListener(
              "place_changed",
              this.handlePlaceSelect
            );
          }, 3000);
        }
      );
    } else {
      this.setState({
        [state]: !this.state[state],
      });
    }
  };

  //change state values of input fields
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handlePlaceSelect = () => {
    const mapsObj = this.autocomplete.getPlace(); //Fetch address details from the Places API based on selected input
    const len = mapsObj.address_components.length;
    console.log(mapsObj);
    //Check if pincode is available in the details, if not, ask for more precision
    if (mapsObj.address_components[len - 1].types.includes("postal_code")) {
      const addressObj = {
        text:
          this.state.houseNo !== ""
            ? this.state.houseNo +
              "," +
              mapsObj.name +
              "," +
              mapsObj.formatted_address
            : mapsObj.name + "," + mapsObj.formatted_address,
        country: mapsObj.address_components[len - 2].long_name,
        state: mapsObj.address_components[len - 3].long_name,
        pincode: mapsObj.address_components[len - 1].long_name,
        coordinates: Object.values(mapsObj.geometry.location.toJSON()),
      };
      this.setState({ address: addressObj, message: "" });
    } else {
      this.setState({
        message: "Please be a bit more precise with the location.",
      });
    }
  };

  handleSubmit = () => {
    //Check if input field --includes-- formatted_address
    if (!this.state.address) {
      this.setState({
        message: "Please select an address. If no updates needed, click CLOSE.",
      });
    } else if (this.state.message === "") {
      const req = this.props.reqObj;
      req.address = this.state.address;
      const formData = new FormData();
      //append object reqBody from PROFILE with the updated address. (Stringified for formdata)
      formData.append("reqBody", JSON.stringify(req));
      Axios.put("/user", formData).then((res) => {
        //Redirect to profile page for fetching details again on successful update
        this.setState({ message: "Updated successfully" }, () =>
          setTimeout(() => {
            this.props.history.push("/profile");
          }, 3000)
        );
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
          Change Address
        </Button>
        <Modal
          className="modal-dialog-centered"
          isOpen={this.state.defaultModal}
          toggle={() => this.toggleModal("defaultModal")}
        >
          <div className="modal-header">
            <h6 className="modal-title" id="modal-title-default">
              Change Billing Address
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
          <Form onSubmit={this.handleSubmit}>
            <div className="modal-body">
              <p className="my-2">
                <strong>Current address:</strong>{" "}
                {this.props.reqObj.address.text}
              </p>
              <Input
                type="text"
                className="my-2"
                required
                placeholder="House No."
              />
              <Input id="autocomplete" ref="input" placeholder="Address" />
              <FormFeedback color="secondary" className="d-block">
                {this.state.message}
              </FormFeedback>
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
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}
export default ChangeAddress;
