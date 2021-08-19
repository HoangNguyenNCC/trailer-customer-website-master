import React, { Component, Fragment } from "react";

// reactstrap components
import {
  Button,
  Modal,
  ListGroup,
  Spinner,
  Popover,
  PopoverHeader,
  PopoverBody,
  ListGroupItem,
} from "reactstrap";
import Axios from "axios";
import Reminder from "./Reminder/Reminder";
import moment from "moment";
/* Props:none
 */
class NotificationPanel extends Component {
  state = {
    loading: false,
    notifications: [],
    reminders: [],
    defaultModal: false,
    popoverOpen: false,
  };

  async componentDidUpdate(prevProps, prevState) {
    //check if dropdown is opened
    if (
      this.state.popoverOpen !== false &&
      prevState.popoverOpen !== this.state.popoverOpen
    ) {
      //fetch reminders from /user/reminders
      let rem = [];
      await this.setState({ loading: true });
      Axios.get("/user/reminders").then((res) => {
        rem = res.data.remindersList;
        // sort reminders by start date of booking
        rem.sort(function (a, b) {
          if (moment(a.start).isAfter(b.start)) {
            return 1;
          } else {
            return -1;
          }
        });
        console.log("reminders", rem);
        this.setState({
          reminders: rem,
          loading: false,
        });
      });
    }
  }
  //switch visibility of modal for those extra reminders
  toggleModal = (state) => {
    this.setState({
      [state]: !this.state[state],
      popoverOpen: false,
    });
  };
  //toggle visibility of dropdown
  popoverToggle = () => {
    this.setState({
      popoverOpen: !this.state.popoverOpen,
    });
  };

  popoverToggle;
  render() {
    const { loading, reminders, popoverOpen } = this.state;
    return (
      <React.Fragment>
        {/* <div onClick={() => this.toggleModal("defaultModal")}> */}
        <div id="notificationPopover">Notifications</div>
        <Popover
          placement="bottom"
          className="popover-container"
          target="notificationPopover"
          isOpen={popoverOpen}
          toggle={this.popoverToggle}
        >
          <PopoverHeader>Notifications</PopoverHeader>
          <PopoverBody>
            {/* Check if UI is loading, if yes, show loading Spinner */}
            {!loading ? (
              <Fragment>
                {reminders.length > 0 && (
                  <Fragment>
                    <ListGroup>
                      {/* Show the 3 latest reminders, and a view more button if more reminders are available */}
                      {reminders
                        .slice(0, Math.min(3, reminders.length))
                        .map((rem, i) => {
                          return <Reminder rem={rem} key={i} />;
                        })}
                      {/* Reminders modal for more than 3 reminders */}
                      {reminders.length > 3 && (
                        <ListGroupItem
                          onClick={() => this.toggleModal("defaultModal")}
                        >
                          <div className="text-center">View more</div>
                        </ListGroupItem>
                      )}
                    </ListGroup>
                  </Fragment>
                )}
                {/* If no reminders are available for the user */}
                {reminders.length === 0 && "No reminders to display"}
              </Fragment>
            ) : (
              <Spinner />
            )}
          </PopoverBody>
        </Popover>
        <Modal
          className="modal-dialog-centered"
          isOpen={this.state.defaultModal}
          toggle={() => this.toggleModal("defaultModal")}
        >
          <div className="modal-header">
            <h6 className="modal-title" id="modal-title-default">
              Reminders & Notifications
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
            {!loading ? (
              <Fragment>
                {reminders.length > 0 && (
                  <Fragment>
                    {/* Reminders shown as list in a modal */}
                    <ListGroup>
                      {reminders.map((rem, i) => {
                        return <Reminder rem={rem} key={i} />;
                      })}
                    </ListGroup>
                  </Fragment>
                )}

                {reminders.length > 0
                  ? ""
                  : "No reminders or notifications to display!"}
              </Fragment>
            ) : (
              <Spinner />
            )}
          </div>
          <div className="modal-footer p-2">
            <Button
              // className="ml-auto"
              color="link"
              data-dismiss="modal"
              type="button"
              onClick={() => this.toggleModal("defaultModal")}
            >
              Close
            </Button>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}
export default NotificationPanel;
