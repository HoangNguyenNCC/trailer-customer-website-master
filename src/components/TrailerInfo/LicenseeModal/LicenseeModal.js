import React, { Component } from "react";
import {
  Container,
  Card,
  Button,
  Row,
  Col,
  CardBody,
  CardImg,
  Modal,
  Spinner,
} from "reactstrap";
import Axios from "axios";
import moment from "moment";
class LicenseeInfo extends Component {
  //LicenseeID is received in Props under the licensee Object

  /* Props:
  licensee : object containing licenseeId
  block: button should be fullWidth or not
  text : Text to be shown in button
  */

  state = {
    exampleModal: false,
  };
  componentDidMount() {
    // Fetch licensee details using id from the props as soon as component is mounted, so no loading required
    Axios.get(`/trailer/licensee?id=${this.props.licensee.licenseeId}`).then(
      (res) => {
        let licensee = res.data.licenseeObj;
        let wHours = licensee.workingHours.split("-");
        console.log(wHours);
        wHours = wHours.map((time) =>
          moment
            .utc("2020-01-01 " + time)
            .local()
            .format("hh:mm")
        );
        console.log(wHours);
        licensee.workingHours = wHours.join("-");
        this.setState({ licenseeObj: licensee });
      }
    );
  }
  toggleModal = (state) => {
    this.setState({
      [state]: !this.state[state],
    });
  };
  render() {
    const { licenseeObj } = this.state;
    return (
      <>
        <Button
          outline={!this.props.block}
          block={this.props.block}
          color="primary"
          onClick={() => this.toggleModal("exampleModal")}
        >
          {this.props.text}
        </Button>
        <Modal
          isOpen={this.state.exampleModal}
          toggle={() => this.toggleModal("exampleModal")}
          style={{
            background: "transparent",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: "0",
              top: "0",
              margin: "1rem",
              fontSize: "3rem",
            }}
            onClick={() => this.toggleModal("exampleModal")}
          >
            <i className="fa fa-times-circle text-primary" />
          </div>
          <section
            className="section"
            style={{
              marginTop: "100px",
            }}
          >
            {this.state.licenseeObj ? (
              <Container>
                <Row>
                  <Col lg={12}>
                    <Card
                      className="card-profile shadow"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <div className="card-profile-image">
                        <img
                          alt="..."
                          className="rounded-circle"
                          src={licenseeObj.ownerPhoto.data}
                          style={{
                            width: "150px",
                            marginTop: "-75px",
                          }}
                        />
                      </div>

                      <div style={{ textAlign: "center" }}>
                        <h3>{licenseeObj.ownerName}</h3>
                        <div className="h6 text-primary font-weight-300">
                          <i className="ni ni-square-pin mr-2" />
                          <span>
                            {licenseeObj.address.city},{" "}
                            {licenseeObj.address.country}
                          </span>
                          {licenseeObj.proofOfIncorporationVerified ? (
                            <p className="text-success font-weight-bold mb-0">
                              Verified
                            </p>
                          ) : (
                            <p className="text-warning font-weight-bold mb-0">
                              Not Verified
                            </p>
                          )}
                          <p className="text-warning">
                            <i
                              className="fa fa-star"
                              style={{ margin: "0 2px" }}
                            />
                            <i
                              className="fa fa-star"
                              style={{ margin: "0 2px" }}
                            />
                            <i
                              className="fa fa-star"
                              style={{ margin: "0 2px" }}
                            />
                            <i
                              className="fa fa-star-o"
                              style={{ margin: "0 2px" }}
                            />
                            <i
                              className="fa fa-star-o"
                              style={{ margin: "0 2px" }}
                            />
                          </p>
                        </div>
                      </div>
                      <div
                        className="rounded border-0 py-2 text-center"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          width: "80%",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: "13px",
                          }}
                        >
                          <i
                            style={{
                              fontSize: "30px",
                            }}
                            className="fa fa-clock-o text-primary"
                          />
                          <span className="ml-2">Timings</span>
                        </div>
                        <div>
                          <h6
                            className="text-primary"
                            style={{
                              marginBottom: "0",
                            }}
                          >
                            {licenseeObj.workingDays.join(", ")}
                          </h6>
                          <div>{licenseeObj.workingHours}</div>
                        </div>
                      </div>
                    </Card>
                  </Col>
                  <Col lg={12}>
                    <Card
                      className="card-profile shadow my-2"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <div
                        className="my-3"
                        style={{
                          width: "90%",
                        }}
                      >
                        <h3 className="display-5 text-center text-primary">
                          Other Trailers by {licenseeObj.ownerName}
                        </h3>
                      </div>
                    </Card>

                    {/* collection for other trailer cards */}
                    <Row
                      style={{
                        maxHeight: "85vh",
                        overflowY: "scroll",
                      }}
                    >
                      {/* Other trailers by the licensee */}
                      {licenseeObj.rentalItems.map((item, i) => {
                        return (
                          <Col md={6} key={i} className="my-2">
                            <Card>
                              <CardBody className="shadow border-0">
                                <CardImg
                                  src={item.photo ? item.photo.data : ""}
                                ></CardImg>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    flexDirection: "column",
                                  }}
                                >
                                  <h5
                                    className=" m-2"
                                    style={{
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {item.name}
                                  </h5>
                                  <Button color="primary">
                                    {item.price.pickUp}
                                  </Button>
                                </div>
                              </CardBody>
                            </Card>
                          </Col>
                        );
                      })}
                    </Row>
                  </Col>
                </Row>
              </Container>
            ) : (
              <Spinner />
            )}
          </section>
        </Modal>
      </>
    );
  }
}

export default LicenseeInfo;
