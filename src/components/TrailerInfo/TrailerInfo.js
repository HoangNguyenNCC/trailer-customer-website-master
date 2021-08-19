import React, { Component, Fragment } from "react";

import { Container, Row, Col, Spinner } from "reactstrap";

import TrailerInfoTable from "./TrailerInfoTable/TrailerInfoTable";
import UpsellItemsCarousel from "./UpsellItemsCarousel/UpsellItemsCarousel";
import LicenseeModal from "./LicenseeModal/LicenseeModal";
import Purchase from "./Purchase/Purchase";
import axios from "axios";
import { connect } from "react-redux";
import store from "../../redux/store";
import { CLEAR_CART } from "redux/types";
import { SET_CART } from "redux/types";
import moment from "moment";
/* Props:
  history : router history
  Redux : 
  searchData : current Search inputs including dates and locations  
  cart : Cart object from redux store
  */

class TrailerInfo extends Component {
  state = {
    trailer: {},
  };
  async componentDidMount() {
    const trailerId = this.props.match.params.trailerId;
    console.log("searchData", this.props.searchData);
    const reqBody = {
      id: trailerId,
      location: this.props.searchData.location,
      dates: this.props.searchData.dates,
      times: this.props.searchData.times,
    };
    store.dispatch({ type: CLEAR_CART }); //Reset cart from store ( data -> cart )

    await axios.post("/trailer/view", reqBody).then((res) => {
      console.log(res);

      //Fetch detailed trailer info

      //Structure list of trailer and upsell item objects with each item object having id, name, type, units and price.
      //This forms the initial rentedItems array in the cart in the store ( data -> cart )
      const items = [
        {
          itemId: res.data.trailerObj._id,
          name: res.data.trailerObj.name,
          itemType: "trailer",
          units: 1,
          price: res.data.trailerObj.totalCharges.rentalCharges,
        },
      ];
      res.data.upsellItemsList.forEach((item) => {
        items.push({
          itemType: "upsellitem",
          itemId: item._id,
          name: item.name,
          units: 0,
          price: item.price,
        });
      });
      //Strucure cart in STORE having all required details for transaction
      const cart = {
        licenseeId: res.data.trailerObj.licenseeId,
        rentedItems: items,
        rentalPeriod: {
          start:
            moment(reqBody.dates[0]).format("YYYY-MM-DD") +
            " " +
            reqBody.times[0],
          end:
            moment(reqBody.dates[1]).format("YYYY-MM-DD") +
            " " +
            reqBody.times[1],
        },
        doChargeDLR: true,
        isPickUp: false,
        pickUpLocation: this.props.searchData.address,
        dropOffLocation: this.props.searchData.address,
      };
      store.dispatch({ type: SET_CART, payload: cart });
      this.setState({
        trailer: res.data.trailerObj,
        licensee: res.data.licenseeObj,
        upsellItems: res.data.trailerObj.upsellItems,
      });
    });
  }
  render() {
    const { trailer, licensee, upsellItems } = this.state;
    return (
      <main ref="main">
        <section
          className="section section-lg section-shaped pb-5"
          style={{
            overflow: "visible",
          }}
        >
          <div className="shape shape-style-1 shape-default">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>

          <Container>
            <Row className="justify-content-center text-center">
              <h3
                className="display-3"
                style={{
                  color: "white",
                }}
              >
                {trailer ? trailer.name : ""}
                {/* <br /> */}
                {/* <small>Licensee 1</small> */}
              </h3>
            </Row>
          </Container>
        </section>
        <div style={{ minHeight: "70vh" }}>
          {trailer.name ? (
            <Fragment>
              <section className="section">
                <Container>
                  <Row>
                    <Col
                      md={6}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={trailer.photos[0] ? trailer.photos[0].data : ""}
                        // src={trailer.photos[0].data}
                        style={{
                          maxWidth: "500px",
                          maxHeight: "500px",
                          width: "80%",
                          height: "80%",
                        }}
                        alt="trailer"
                      />
                    </Col>
                    <Col md={6}>
                      <p>{trailer.description}</p>
                      <TrailerInfoTable trailer={trailer} />
                    </Col>
                  </Row>
                  <Row
                    className="mx-2 "
                    style={{
                      justifyContent: "space-between",
                    }}
                  >
                    <Col md={5}>
                      <Row>
                        <Col xs={12}>
                          {upsellItems.length > 0 ? (
                            <UpsellItemsCarousel upsellItems={upsellItems} />
                          ) : (
                            <div className="text-muted text-center py-3">
                              No upsell items available.
                            </div>
                          )}
                        </Col>
                      </Row>
                    </Col>

                    <Col md={6}>
                      <Col
                        xs={12}
                        className="rounded shadow border-0 py-3 mb-4 "
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                          boxSizing: "border-box",
                        }}
                      >
                        <div>
                          <h5
                            className="display-5 text-primary mb-0"
                            style={{
                              fontWeight: "bold",
                            }}
                          >
                            {trailer.total}
                          </h5>
                        </div>
                        <Purchase
                          cart={this.props.cart}
                          photo={
                            trailer.photos[0] ? trailer.photos[0].data : ""
                          }
                          history={this.props.history}
                        />
                      </Col>
                      <Col
                        xs={12}
                        className="align-items-center py-3 mb-4 rounded shadow border-0"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <i
                          className="ni ni-circle-08 text-primary"
                          style={{
                            fontSize: "50px",
                          }}
                        />
                        <div>
                          <h6 className="display-6">
                            <strong>OWNED BY</strong>
                          </h6>
                          <h6 className="text-primary">{licensee.ownerName}</h6>
                        </div>
                        <div>
                          <LicenseeModal
                            licensee={licensee}
                            block={false}
                            text="View"
                          />
                        </div>
                      </Col>
                    </Col>
                  </Row>
                </Container>
              </section>
            </Fragment>
          ) : (
            <Spinner
              className="my-5"
              style={{
                width: "3rem",
                height: "3rem",
                display: "flex",
                margin: "auto",
              }}
            />
          )}
        </div>
      </main>
    );
  }
}
const mapStateToProps = (state) => ({
  searchData: state.data.search,
  cart: state.data.cart,
});
export default connect(mapStateToProps)(TrailerInfo);
