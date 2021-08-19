// Confirmation Modal accessed by clicking on Rent Trailer on the trailer view page

import React from "react";
// reactstrap components
import {
  Button,
  Modal,
  ListGroup,
  ListGroupItem,
  UncontrolledCollapse,
  Spinner,
  Badge,
} from "reactstrap";
import Axios from "axios";
import moment from "moment";
import { connect } from "react-redux";
import { setBooking } from "../../../redux/actions/dataActions";
import { toast } from "react-toastify";

/* Props:
  history : react - router
    cart : structured cart object having all necessary details of current booking flow
    photo : Trailer photo
    Redux :
      setBooking() : to set booking object in store -> data
*/
class Purchase extends React.Component {
  state = {
    purchaseModal: false,
  };
  toggleModal = (state) => {
    this.setState({
      [state]: !this.state[state],
    });
  };

  async componentDidUpdate(prevProps, prevState) {
    if (this.state.purchaseModal && !prevState.purchaseModal) {
      console.log(this.props.cart);
      const filterItems = this.props.cart.rentedItems.filter(
        (item) => item.units !== 0
      );
      this.props.cart.rentedItems = filterItems;
      const inv = this.props.cart;

      //New object made according to the structure required by the booking route from the cart
      console.log("INVOICE", inv);
      const bookingObj = {};
      bookingObj.trailerId = inv.rentedItems[0].itemId;
      bookingObj.trailerName = inv.rentedItems[0].name;
      bookingObj.trailerPrice = inv.rentedItems[0].price;
      bookingObj.upsellItemIds = [];
      // inv.rentedItems.shift();
      inv.rentedItems.forEach((item, i) => {
        if (i !== 0) {
          bookingObj.upsellItemIds.push(
            item.itemId
            //   {
            //   id:item.itemId,
            //   // name:item.name,
            //   units:item.units
            // }
          );
        }
      });
      bookingObj.customerId = JSON.parse(localStorage.getItem("user"))._id;
      bookingObj.startDate = inv.rentalPeriod.start;
      bookingObj.endDate = inv.rentalPeriod.end;
      bookingObj.isPickUp = inv.isPickUp;
      bookingObj.customerLocation = {};
      bookingObj.customerLocation.text = inv.dropOffLocation.text;
      bookingObj.customerLocation.pincode = inv.dropOffLocation.pincode;
      bookingObj.customerLocation.coordinates = inv.dropOffLocation.coordinates;
      bookingObj.dlrCharges = true;
      const charges = {};
      await Axios.get(`/booking/charges`, {
        params: {
          trailerId: bookingObj.trailerId,
          startDate: bookingObj.startDate,
          endDate: bookingObj.endDate,
          isPickUp: false,
        },
      }).then(async (res) => {
        charges = res.data;
        console.log("Charges", charges);
      });
      console.log("BOOKING", bookingObj);
      await this.setState({ booking: bookingObj, charges });
    }
  }

  handleSubmit = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    //If mobile number has not been verified, send back to profile page
    // if (!user.isMobileVerified) {
    //   toast.error("Mobile Number not verified.", {
    //     position: "bottom-center",
    //     autoClose: 5000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: false,
    //     draggable: true,
    //     progress: undefined,
    //   });
    //   this.props.history.push("/profile");
    // }
    // //If email has not been verified, send back to profile page
    // else if (!user.isEmailVerified) {
    //   toast.error("Email not verified.", {
    //     position: "bottom-center",
    //     autoClose: 5000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: false,
    //     draggable: true,
    //     progress: undefined,
    //   });
    //   this.props.history.push("/profile");
    // } else if (!user.driverLicense.verified) {
    //   //If DL has not been verified, send back to profile page
    //   toast.error("Driver License not verified by Admin.", {
    //     position: "bottom-center",
    //     autoClose: 5000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: false,
    //     draggable: true,
    //     progress: undefined,
    //   });
    //   this.props.history.push("/profile");
    // }
    this.props.setBooking(this.state.booking); //Set booking in store -> data
    this.props.history.push("/booking/checkout");
  };

  handleDLR = () => {
    console.log("Hello", this.state);
    this.setState(
      {
        booking: {
          ...this.state.booking,
          dlrCharges: !this.state.booking.dlrCharges,
        },
      },
      () => {
        console.log("Hello", this.state);
      }
    );
  };

  render() {
    // const {cart}=this.props;
    return (
      <>
        {/* Button trigger modal */}
        <Button
          color="primary"
          type="button"
          onClick={() => this.toggleModal("purchaseModal")}
          style={{
            borderRadius: "2rem",
          }}
        >
          Rent Trailer
        </Button>
        {/* Modal */}
        <Modal
          className="modal-dialog-centered"
          isOpen={this.state.purchaseModal}
          toggle={() => this.toggleModal("purchaseModal")}
        >
          <div className="modal-header">
            <h5 className="modal-title" id="purchaseModalLabel">
              Complete Transaction
            </h5>
            <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={() => this.toggleModal("purchaseModal")}
            >
              <span aria-hidden={true}>×</span>
            </button>
          </div>
          <div className="modal-body">
            {this.state.booking ? (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <img
                  style={{ width: "70%" }}
                  src={this.props.photo}
                  alt="trailer"
                />
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
                          .utc(this.state.booking.startDate)
                          .local()
                          .format("DD MMM")}
                      </div>
                      <div>
                        {moment
                          .utc(this.state.booking.startDate)
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
                          .utc(this.state.booking.endDate)
                          .local()
                          .format("DD MMM")}
                      </div>
                      <div>
                        {moment
                          .utc(this.state.booking.endDate)
                          .local()
                          .format("hh:mm A")}
                      </div>
                    </div>
                  </ListGroupItem>
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
                      {this.props.cart.dropOffLocation.text}
                    </div>
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
                      {/* {invoice.total} AUD */}
                      {this.state.booking.dlrCharges
                        ? `${this.state.charges.total} AUD`
                        : `${(
                            this.state.charges.total -
                            this.state.charges.dlrCharges
                          ).toFixed(2)} AUD`}
                    </div>
                    <i className="fa fa-chevron-right" />
                  </ListGroupItem>
                  <UncontrolledCollapse toggler="#purchase-details-toggler">
                    {this.props.cart.rentedItems.map((item, i) => (
                      <ListGroupItem
                        key={i}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        {/* <div>{item.itemName}</div>
                        <div>{item.totalCharges.total} AUD</div> */}
                        <div>
                          {item.units} x {item.name}
                        </div>
                        <div>{item.price}</div>
                      </ListGroupItem>
                    ))}
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
                        <h6 className="font-weight-bold">Damage Waiver</h6>

                        <p
                          className="text-gray"
                          style={{
                            fontSize: "10px",
                          }}
                        >
                          Damage waiver covers any and all damage to the
                          trailer. Waiving it might result in excess charges if
                          trailer is damaged.
                        </p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "right",
                          flexDirection: "column",
                        }}
                      >
                        {/* <CustomInput type="switch" name="customSwitch" color="success"></CustomInput> */}
                        <Badge color="primary" onClick={this.handleDLR}>
                          {this.state.booking.dlrCharges ? "Remove" : "Add"}
                        </Badge>
                        <div className="mt-2">
                          {this.state.charges.dlrCharges} AUD
                        </div>
                      </div>
                    </ListGroupItem>
                    <ListGroupItem
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>Taxes and VAT</div>
                      {/* <div>{invoice.totalCharges.taxes} AUD</div> */}
                      <div>{this.state.charges.taxes} AUD</div>
                    </ListGroupItem>
                  </UncontrolledCollapse>
                </ListGroup>
              </div>
            ) : (
              <Spinner />
            )}
          </div>
          <div className="modal-footer">
            <Button color="primary" type="button" onClick={this.handleSubmit}>
              Order Now
            </Button>
          </div>
        </Modal>
      </>
    );
  }
}

const mapDispatchToProps = {
  setBooking,
};

export default connect(null, mapDispatchToProps)(Purchase);
