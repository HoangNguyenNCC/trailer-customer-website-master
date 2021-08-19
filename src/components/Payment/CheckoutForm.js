import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import moment from "moment";
import "./CheckoutForm.css";

import {
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  UncontrolledCollapse,
  Badge,
  Spinner,
} from "reactstrap";
import { connect } from "react-redux";
import Axios from "axios";
import { toast } from "react-toastify";

/* Props:
  booking : object having details of the current booking from store
  cart : object having details of the active cart for locations and other display data
  history : react - router
*/

function CheckoutForm(props) {
  const [succeeded, setSucceeded] = useState(false); //Hook for flag if payment has succeeded
  const [error, setError] = useState(null); //Hook to set error text
  const [booking, setBooking] = useState(null); //Hook to set booking object in state
  const [processing, setProcessing] = useState(""); //Hook to flag payment is in processing stage
  const [disabled, setDisabled] = useState(true); //To disable pay now button
  const [clientSecret, setClientSecret] = useState(""); //setClientsecret received from /booking api
  const stripe = useStripe(); //stripe hook from react-stripe-js

  const elements = useElements();
  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    Axios.post("/booking", props.booking)
      .then((res) => {
        console.log("Booking", res.data);
        setBooking(res.data.booking);
        //setClientsecret from the /booking response
        setClientSecret(res.data.stripeClientSecret);
      })
      .catch((err) => {
        setDisabled(true);
        setError(`Booking failed. ${err.response.data.message}`);
        toast.error(`${err.response.data.error}`, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
        });
        //redirect to home page if booking route shows up with error
        setTimeout(() => {
          props.history.push("/");
        }, 5000);
      });
  }, []);

  //Styles for stripe's card input component
  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };
  const handleChange = async (event) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setProcessing(true);
    // Attempt payment via Stripe
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: ev.target.name.value,
        },
      },
    });

    // If payment fails, show error as toast
    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
      toast.error("Payment Failed! Try again.", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
    } else {
      //If payment is successful, show success as toast and then redirect to home page.
      setError(null);
      setProcessing(false);
      setDisabled(true);
      setSucceeded(true);
      toast.success("Payment Successful! Check Notifications.", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        props.history.push("/");
      }, 2000);
    }
  };
  return (
    <div className="h-100">
      <section className=" section-profile-cover section-shaped my-0">
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
            <polygon className="fill-white" points="2560 0 2560 100 0 100" />
          </svg>
        </div>
      </section>

      <Row>
        {/* Show booking details and price breakup as dropdown or loading spinner if waiting for response */}
        {booking === null ? (
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
          <Col lg={7} className="cardMargin">
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
                      .utc(props.booking.startDate)
                      .local()
                      .format("DD MMM")}
                    {/* 28 Jul */}
                  </div>
                  <div>
                    {moment
                      .utc(props.booking.startDate)
                      .local()
                      .format("hh:mm A")}
                    {/* 6 : 30 PM */}
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
                    {moment.utc(props.booking.endDate).local().format("DD MMM")}
                    {/* 30 Jul */}
                  </div>
                  <div>
                    {moment
                      .utc(props.booking.endDate)
                      .local()
                      .format("hh:mm A")}
                    {/* 6 PM */}
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
                  {props.cart.dropOffLocation.text}
                  {/* SOME long address,long address,long address,long address,long address, */}
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
                  {/* {booking.total} AUD */}
                  Total :{" "}
                  {Math.round(
                    (booking.trailerCharges +
                      booking.dlrCharges +
                      booking.taxes +
                      Number.EPSILON) *
                      100
                  ) / 100}{" "}
                  AUD
                </div>
                <i className="fa fa-chevron-right" />
              </ListGroupItem>
              <UncontrolledCollapse
                defaultOpen={false}
                toggler="#purchase-details-toggler"
              >
                {props.cart.rentedItems.map((item, i) => (
                  <ListGroupItem
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      {item.units} x {item.name}
                    </div>
                    {i === 0 && <div>{booking.trailerCharges} AUD</div>}
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
                      Damage waiver covers any and all damage to the trailer.
                      Waiving it might result in excess charges if trailer is
                      damaged.
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "right",
                      flexDirection: "column",
                    }}
                  >
                    <Badge color="primary">
                      {props.booking.dlrCharges ? "ADDED" : "NOT ADDED"}
                    </Badge>
                    {props.booking.dlrCharges ? (
                      <div className="mt-2">{booking.dlrCharges} AUD</div>
                    ) : (
                      ""
                    )}
                  </div>
                </ListGroupItem>
                <ListGroupItem
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div>Taxes and VAT</div>
                  {/* <div>{booking.totalCharges.taxes} AUD</div> */}
                  <div> {booking.taxes} AUD </div>
                </ListGroupItem>
              </UncontrolledCollapse>
            </ListGroup>

            {/* PAYMENT FORM FOR CREDIT/DEBIT CARDS */}
            <form
              className="pay-form"
              id="payment-form"
              onSubmit={handleSubmit}
            >
              <CardElement
                id="card-element"
                options={cardStyle}
                onChange={handleChange}
              />
              <button
                className="pay-button"
                disabled={processing || disabled || succeeded}
                id="submit"
              >
                <span id="button-text">
                  {processing ? (
                    <div className="spinner" id="spinner"></div>
                  ) : (
                    "Pay"
                  )}
                </span>
              </button>
              {/* Show any error that happens when processing the payment */}
              {error && (
                <div id="card-error" role="alert">
                  {error}
                </div>
              )}
              {/* Show a success message upon completion */}
              <p
                className={
                  succeeded ? "result-message" : "result-message hidden"
                }
              >
                Payment succeeded.
              </p>
            </form>
          </Col>
        )}
      </Row>
    </div>
  );
}

const mapStateToProps = (state) => ({
  booking: state.data.booking, //booking details from store -> data
  cart: state.data.cart, //cart details from store -> data
});

export default connect(mapStateToProps)(CheckoutForm);
