//Modal component to process a reschedule booking request for the booking

import React from "react";
// reactstrap components
import {
  Button,
  Modal,
  UncontrolledAlert,
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  FormGroup,
} from "reactstrap";
import ReactDatetime from "react-datetime";
import moment from "moment";
import Axios from "axios";
import { toast } from "react-toastify";

/* Props:
  reschedObj : Object having rental period and id of the booking
  history : the history object from React Router
*/
class RescheduleModal extends React.Component {
  state = {
    defaultModal: false,
    fromDate: "",
    toDate: "",
    message: "",
  };

  //toggle visibility of rescheduleModal

  toggleModal = (state) => {
    this.setState({
      [state]: !this.state[state],
    });
  };

  //Update values in state of input components

  handleDateChange = (date, name) => {
    this.setState({
      [name]: moment(date).format("YYYY-MM-DD HH:mm"),
    });
  };

  //set initial date values from object passed in props
  componentDidMount() {
    this.setState({
      fromDate: moment
        .utc(this.props.reschedObj.rentalPeriod.start)
        .local()
        .format("YYYY-MM-DD HH:mm"),
      toDate: moment
        .utc(this.props.reschedObj.rentalPeriod.end)
        .local()
        .format("YYYY-MM-DD HH:mm"),
    });
  }

  // FORM SUBMISSION : /rental/reschedule
  /* 
    body: rentalId :id of booking,
          start : booking start date in "YYYY-MM-DD HH:mm"
          end : booking end date in "YYYY-MM-DD HH:mm"
  */

  handleSubmit = () => {
    const { fromDate, toDate } = this.state;
    const reqObj = {
      rentalId: this.props.reschedObj.id,
      bookingId: this.props.reschedObj.id,
      newStartDate: moment(fromDate).utc().format("YYYY-MM-DD HH:mm"),
      newEndDate: moment(toDate).utc().format("YYYY-MM-DD HH:mm"),
      type: "reschedule",
    };
    Axios.post("/rental/edit", reqObj)
      .then((res) => {
        toast.success("🙌 Reschedule requested successfully.", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        //  Reload booking page after staying in modal for 2 seconds, so that updated booking data is fetched
        setTimeout(() => {
          this.props.history.push(`/booking/${reqObj.rentalId}`);
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
        toast.error("❌ Reschedule request failed.", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
    //
  };
  render() {
    const { fromDate, toDate } = this.state;
    return (
      <React.Fragment>
        <Button
          color="primary"
          size="sm"
          onClick={() => this.toggleModal("defaultModal")}
        >
          Reschedule Booking
        </Button>
        <Modal
          className="modal-dialog-centered"
          isOpen={this.state.defaultModal}
          toggle={() => this.toggleModal("defaultModal")}
        >
          <div className="modal-header">
            <h6 className="modal-title" id="modal-title-default">
              Reschedule Booking
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
            {/* Dismissable alert to show any errors */}
            {this.state.message.length > 0 && (
              <UncontrolledAlert color="warning">
                {this.state.message}
              </UncontrolledAlert>
            )}

            <Row>
              <Col sm={6}>
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-calendar-grid-58" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <ReactDatetime
                      inputProps={{
                        placeholder: "From Date",
                        required: true,
                        //handle null value in fromDate
                        value: fromDate ? fromDate : "",
                        style: {
                          width: "100%",
                        },
                      }}
                      //only valid dates are those after today
                      isValidDate={(currentDate) => {
                        return currentDate.isAfter(ReactDatetime.moment());
                      }}
                      //moment object passed with name of field to be updated
                      onChange={(moment) =>
                        this.handleDateChange(moment, "fromDate")
                      }
                      // timeConstraints for working hours
                      timeConstraints={{
                        hours: {
                          min: 9,
                          max: 20,
                        },
                        minutes: {
                          step: 15,
                        },
                      }}
                    />
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col sm={6}>
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-calendar-grid-58" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <ReactDatetime
                      inputProps={{
                        placeholder: "To Date",
                        required: true,
                        value: toDate ? toDate : "",
                      }}
                      isValidDate={(currentDate) => {
                        return currentDate.isAfter(ReactDatetime.moment());
                      }}
                      onChange={(moment) =>
                        this.handleDateChange(moment, "toDate")
                      }
                      timeConstraints={{
                        hours: {
                          min: 9,
                          max: 20,
                        },
                        minutes: {
                          step: 15,
                        },
                      }}
                    />
                  </InputGroup>
                </FormGroup>
              </Col>
            </Row>
          </div>
          <div className="modal-footer">
            {/* Close modal */}
            <Button
              className="ml-auto"
              color="link"
              data-dismiss="modal"
              type="button"
              onClick={() => this.toggleModal("defaultModal")}
            >
              Close
            </Button>
            {/* Submit cancellation request */}
            <Button color="primary" onClick={this.handleSubmit}>
              Submit
            </Button>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}
export default RescheduleModal;
