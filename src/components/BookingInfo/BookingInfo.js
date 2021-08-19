/*
  This file has the main component for the Booking Details page.
  Can be accessed by clicking on a reminder.
*/

import React, { Component } from "react";
import moment from "moment";
import {
  Container,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Badge,
  Card,
  CardBody,
  CardImg,
  UncontrolledCollapse,
  Button,
  Spinner,
} from "reactstrap";

import LicenseeModal from "../TrailerInfo/LicenseeModal/LicenseeModal";

import Radium, { StyleRoot } from "radium";
import Axios from "axios";
import TrackTrailer from "./TrackTrailer/TrackTrailer";
import RescheduleModal from "./RescheduleModal/RescheduleModal";
import RequestCancellation from "./RequestCancellation/RequestCancellation";

const status = {
  0: { text: "Approval Pending", className: "text-info" },
  1: { text: "Approved", className: "text-success" },
  2: { text: "Cancelled", className: "text-danger" },
};
//object for inline styles

const styles = {
  cardMargin: {
    marginTop: "-400px",
    "@media screen and (max-width:991px)": {
      marginTop: "-300px",
    },
  },
};
/* Props:
  history : the history object from React Router
*/
class BookingInfo extends Component {
  //async lifecycle function which fetches the booking details from /rental?id=... as soon as the component mounts
  /*
    state has booking:all details of the booking
              licenseeObj: licenseeId in an object for passing down to the LicenseeModal for details
              reschedObj: rentalId and period passed on to rescheduleModal for rescheduling a booking
  */

  async componentDidMount() {
    let bookObj;
    let licensee = {};
    let reschedObj = {};
    let revisionObj = {};
    await Axios.get(`/rental?id=${this.props.match.params.bookingId}`).then(
      (res) => {
        bookObj = res.data.rentalObj;
        revisionObj = bookObj.revisions[bookObj.revisions.length - 1];
        licensee.licenseeId = bookObj.licenseeId;
        reschedObj.id = bookObj._id;
        reschedObj.rentalPeriod = {
          start: revisionObj.start,
          end: revisionObj.end,
        };
      }
    );
    console.log(bookObj);

    await this.setState({
      booking: bookObj,
      licensee,
      reschedObj,
      revisionObj,
    });
  }
  render() {
    const { booking, licensee, reschedObj, revisionObj } = this.state;
    return (
      <StyleRoot>
        <main>
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
          <section className="section" style={styles.cardMargin}>
            <Container>
              {/* if booking object doesn;t exist in state, a loading spinner is shown. Booking is not initialized in state, so it only comes up aftfer componentdidMount() has completeed */}

              {!booking ? (
                <Spinner
                  className="my-5"
                  style={{
                    width: "3rem",
                    height: "3rem",
                    display: "flex",
                    margin: "auto",
                  }}
                />
              ) : (
                <Row>
                  <Col lg={5}>
                    <Card className="mb-4 pb-4 br-2">
                      <CardBody>
                        <CardImg
                          src={
                            booking.rentedItems[0].itemPhoto
                              ? booking.rentedItems[0].itemPhoto.data
                              : ""
                          }
                          alt="trailer"
                        />
                      </CardBody>
                      <Container>
                        <Row>
                          <Container
                            style={{
                              display: "flex",
                            }}
                          >
                            <div
                              style={{
                                flex: "1",
                              }}
                              className="text-primary font-weight-bold"
                            >
                              {booking.rentedItems[0].itemName}
                            </div>
                          </Container>
                        </Row>
                        <Row className="my-4">
                          <Container
                            style={{
                              display: "flex",
                            }}
                          >
                            <Col>
                              {/* Component for rescheduling booking */}
                              <RescheduleModal
                                reschedObj={reschedObj}
                                history={this.props.history}
                              />
                            </Col>
                            <Col>
                              {/* Modal Component for cancelling booking */}
                              <RequestCancellation
                                rentalId={reschedObj.id}
                                history={this.props.history}
                              />
                            </Col>
                          </Container>
                        </Row>
                        <TrackTrailer
                          coord={booking.dropOffLocation.coordinates}
                          rentalId={this.props.match.params.bookingId}
                          text={
                            booking.isTrackingDropOff
                              ? "Track Trailer"
                              : "Tracking not started yet"
                          }
                          disabled={!booking.isTrackingDropOff}
                        />
                      </Container>
                    </Card>
                  </Col>
                  <Col lg={7}>
                    <ListGroup style={{ width: "100%" }}>
                      <ListGroupItem
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <div
                            className="font-weight-bold"
                            style={{
                              fontSize: "1.25rem",
                            }}
                          >
                            {moment
                              .utc(revisionObj.start)
                              .local()
                              .format("DD MMM")}
                          </div>
                          <div>
                            {moment
                              .utc(revisionObj.start)
                              .local()
                              .format("hh:mm A")}
                          </div>
                        </div>
                        <i className="fa fa-arrow-right text-primary" />
                        <div>
                          <div
                            className="font-weight-bold"
                            style={{
                              fontSize: "1.25rem",
                            }}
                          >
                            {moment
                              .utc(revisionObj.end)
                              .local()
                              .format("DD MMM")}
                          </div>
                          <div>
                            {moment
                              .utc(revisionObj.end)
                              .local()
                              .format("hh:mm A")}
                          </div>
                        </div>
                      </ListGroupItem>
                      {booking.dropOffLocation.text && (
                        <ListGroupItem
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                            alignItems: "center",
                          }}
                          className="px-5"
                        >
                          <div>
                            <i className="fa fa-location-arrow text-primary" />
                          </div>
                          <div
                            style={{
                              textAlign: "right",
                            }}
                            className="ml-3"
                          >
                            {booking.dropOffLocation.text}
                          </div>
                        </ListGroupItem>
                      )}
                      <ListGroupItem className="text-center font-weight-bold">
                        RENTAL STATUS :{" "}
                        <span
                          className={status[revisionObj.isApproved].className}
                        >
                          {status[revisionObj.isApproved].text.toUpperCase()}
                        </span>
                      </ListGroupItem>
                      <ListGroupItem
                        id="purchase-details-toggler"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                        className="px-5 font-weight-bold text-primary"
                      >
                        <div
                          className="font-weight-bold"
                          style={{
                            fontSize: "1.25rem",
                          }}
                        >
                          {revisionObj.totalCharges.total} AUD
                        </div>
                        <i className="fa fa-chevron-right" />
                      </ListGroupItem>

                      {/* Dropdown for booking details and price breakup */}

                      <UncontrolledCollapse
                        defaultOpen
                        toggler="#purchase-details-toggler"
                      >
                        {booking.rentedItems.map((item, i) => (
                          <ListGroupItem
                            key={i}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <div>{item.itemName}</div>
                            <div>{item.totalCharges.rentalCharges} AUD</div>
                          </ListGroupItem>
                        ))}

                        {booking.doChargeDLR && (
                          <ListGroupItem
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <div
                              className="mr-4"
                              style={{
                                maxWidth: "60%",
                              }}
                            >
                              <h6 className="font-weight-bold">
                                Damage Waiver
                              </h6>
                              <p
                                className="text-gray"
                                style={{
                                  fontSize: "10px",
                                }}
                              >
                                Damage waiver covers any and all damage to the
                                trailer. Waiving it might result in excess
                                charges if trailer is damaged.
                              </p>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "right",
                                flexDirection: "column",
                              }}
                            >
                              <Badge color="primary">Added</Badge>
                              <div className="mt-2">
                                {revisionObj.totalCharges.dlrCharges} AUD
                              </div>
                            </div>
                          </ListGroupItem>
                        )}
                        <ListGroupItem
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div>Taxes and VAT</div>
                          <div>{revisionObj.totalCharges.taxes} AUD</div>
                        </ListGroupItem>
                      </UncontrolledCollapse>
                    </ListGroup>
                    <Row className="my-4">
                      <Container
                        style={{
                          display: "flex",
                        }}
                      >
                        {/* <Col>
                          <Button className="" block size="md" color="info">
                            Download Invoice
                          </Button>
                        </Col> */}
                        <Col>
                          {/* Component to show details of a particular licensee ( Reused from the TrailerInfo Screen) */}
                          <LicenseeModal
                            block={true}
                            licensee={licensee}
                            text="View Owner Info"
                          />
                        </Col>
                      </Container>
                    </Row>
                  </Col>
                </Row>
              )}
            </Container>
          </section>
        </main>
      </StyleRoot>
    );
  }
}

export default Radium(BookingInfo);
