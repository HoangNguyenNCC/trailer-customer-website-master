import React, { Fragment } from "react";
import { animateScroll as scroll } from "react-scroll";
import ReactDatetime from "react-datetime";
/*global google*/

//Initializing the google variable from a pre-loaded Maps Script
// reactstrap components

import {
  Button,
  FormGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
  Spinner,
  UncontrolledAlert,
} from "reactstrap";
import FeaturedTrailerCard from "./FeaturedTrailerCard/FeaturedTrailerCard";
import axios from "axios";
import moment from "moment";
import { connect } from "react-redux";
import { searchTrailers, setFeatured } from "../../redux/actions/dataActions"; //redux action to initiate trailer search requests
import { startLoading, stopLoading } from "../../redux/actions/UIActions";
import ErrorShow from "components/Validation/ErrorShow/ErrorShow"; //Component to display errors
import { toast } from "react-toastify";

/* Props:
  loading (redux) : If UI is loading or not
  stopLoading() and startLoading() --Redux-- : Set loading value in store -> UI
  searchTrailers() --Redux-- : To initiate search -- Params : Request object for search, history object from router, and page from where search was called
*/
class HomePage extends React.Component {
  state = {
    featured: [],
    location: "",
    fromDate: "",
    toDate: "",
    toTime: "",
    fromTime: "",
  };
  componentDidMount() {
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("autocomplete"),
      {}
    );

    this.autocomplete.addListener("place_changed", this.handlePlaceSelect);
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;
    this.props.startLoading();
    axios
      .get("/featured")
      .then((res) => {
        this.setState({ featured: res.data.trailers });
        this.props.stopLoading();
        const user = JSON.parse(localStorage.getItem("user"));
        toast.success(`😉 Hello ${user.name}!`, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch((err) => {
        this.props.stopLoading();
        console.log(err);
      });
  }

  handleDateChange = (date, name) => {
    const d = moment(date).format("DD MMM,YYYY"); // 28 Jul,2020
    const t = moment(date).format("kk:mm"); //24hr Time format
    if (name === "fromDate") {
      this.setState({
        fromDate: d,
        fromTime: t,
        fromUTC: date,
      });
    } else {
      this.setState({
        toDate: d,
        toTime: t,
        toUTC: date,
      });
    }
  };
  handleSubmit = () => {
    const { fromUTC, toUTC, location, address, addressError } = this.state;

    //If any fields are empty or there's an error with the address, stop submit
    if (!fromUTC || !toUTC || !address || addressError) {
      this.setState({ addressError: "Fields can't be empty" });
      return false;
    }

    // if the start date is after end date, stop submit
    if (moment(fromUTC).isAfter(toUTC)) {
      this.setState({
        dateError: "From date cannot be after or same as To Date",
      });
      return false;
    }
    const fromDate = moment(fromUTC).utc().format("DD MMM,YYYY"); // 28 Jul,2020
    const fromTime = moment(fromUTC).utc().format("kk:mm"); //24hr Time format
    const toDate = moment(toUTC).utc().format("DD MMM,YYYY"); // 28 Jul,2020
    const toTime = moment(toUTC).utc().format("kk:mm"); //24hr Time format
    const reqObj = {
      address: address, //address object containing text, pincode and coordinates
      location: location, //location : array of coordinates (float)
      dates: [fromDate, toDate], //date range [start,end]
      times: [fromTime, toTime], //time range [start,end]
    };

    //redux action to initiate trailer search, history passed to facilitate redirects
    this.props.searchTrailers(
      reqObj,
      this.props.history,
      "home",
      this.props.featured
    );
  };

  handlePlaceSelect = () => {
    const mapsObj = this.autocomplete.getPlace(); //inbuilt function to get entire addres object from the Places API
    console.log(mapsObj);
    const len = mapsObj.address_components.length;

    //check if the address does contain a pincode field, else ask for more precision
    if (mapsObj.address_components[len - 1].types.includes("postal_code")) {
      const loc = mapsObj.geometry.location.toJSON();
      const address = {
        text: mapsObj.name + ", " + mapsObj.formatted_address,
        pincode: mapsObj.address_components[len - 1].long_name,
        coordinates: [loc.lat, loc.lng],
      };

      this.setState({
        address: address,
        location: [loc.lat, loc.lng],
        addressError: "",
      });
    } else {
      this.setState({
        addressError: "Please be a bit more precise with the location",
      });
    }
  };

  handleFeature = (type) => {
    this.props.setFeatured(type);
    // window.scrollTo(0, 0);
    scroll.scrollToTop();
  };

  render() {
    const { fromDate, toDate, fromTime, toTime, featured } = this.state;
    return (
      <>
        <main ref="main">
          <section
            className="section section-lg section-shaped pb-250"
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
            <Container className="py-lg-md d-flex">
              <div className="col px-0">
                <Row style={{ justifyContent: "center", textAlign: "center" }}>
                  <Col lg="6">
                    <h1 className="display-3 text-white">Trailer 2 You</h1>
                    <p className="lead text-white">
                      Let's help you get a trailer out of the thousands of
                      options to choose from!
                    </p>
                    {this.props.featured.length > 0 && (
                      <Fragment>
                        <Row>
                          <UncontrolledAlert
                            color="warning"
                            toggle={
                              this.props.featured.length > 0 &&
                              (() => this.props.setFeatured(""))
                            }
                            className="p-2 w-100"
                          >
                            Searching for {this.props.featured} , dismiss to
                            remove filter
                          </UncontrolledAlert>
                        </Row>
                      </Fragment>
                    )}

                    <Row>
                      <Col>
                        <FormGroup>
                          <InputGroup className="input-group-alternative mb-4">
                            <Input
                              placeholder="Find a Trailer"
                              id="autocomplete"
                              ref="input"
                              type="text"
                              required
                            />
                            <InputGroupAddon addonType="append">
                              <InputGroupText>
                                <i className="ni ni-zoom-split-in" />
                              </InputGroupText>
                            </InputGroupAddon>
                          </InputGroup>
                        </FormGroup>
                        <ErrorShow>{this.state.addressError}</ErrorShow>
                      </Col>
                    </Row>
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
                                //Prevent null value as field input
                                value: fromDate
                                  ? fromDate + " " + fromTime
                                  : "",
                                style: {
                                  width: "100%",
                                },
                              }}
                              //only dates after current are valid
                              isValidDate={(currentDate) => {
                                return currentDate.isAfter(
                                  ReactDatetime.moment()
                                );
                              }}
                              //handle date changes, moment object passed for date along with the name of field to be updated
                              onChange={(moment) =>
                                this.handleDateChange(moment, "fromDate")
                              }
                              //time constraints according to working hours
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
                                value: toDate ? toDate + " " + toTime : "",
                              }}
                              isValidDate={(currentDate) => {
                                if (fromDate) {
                                  return currentDate.isAfter(fromDate);
                                }
                                return currentDate.isAfter(
                                  ReactDatetime.moment()
                                );
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
                    <ErrorShow>{this.state.dateError}</ErrorShow>
                    <Row className="justify-content-center">
                      <Col xs={6}>
                        <Button
                          block
                          color="warning"
                          type="submit"
                          onClick={this.handleSubmit}
                          // href="/search"
                          size="md"
                        >
                          Search
                        </Button>
                      </Col>
                    </Row>
                    {this.props.errors}
                  </Col>
                </Row>
              </div>
            </Container>

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

          <section className="section section-lg pt-lg-0 mt--200">
            <Container>
              <Row className="justify-content-center">
                <Col lg="12">
                  {/* Display a GRID of featured trailers as cards as and when the list gets fetched from the backend */}
                  {this.props.loading ? (
                    <Spinner />
                  ) : (
                    <Row className="row-grid text-center">
                      {featured.map((trailer, i) => {
                        return (
                          <FeaturedTrailerCard
                            handleFeature={this.handleFeature}
                            trailer={trailer}
                            key={i}
                          />
                        );
                      })}
                    </Row>
                  )}
                </Col>
              </Row>
            </Container>
          </section>
        </main>
      </>
    );
  }
}

const mapStateTOProps = (state) => ({
  featured: state.data.featured,
  loading: state.UI.loading, // flag to check if UI is in a loading state for showing Spinners
});

const mapDispatchToProps = {
  searchTrailers,
  setFeatured,
  startLoading, //sets loading to true in store -> UI
  stopLoading, //sets loading to false in store -> UI
};

export default connect(mapStateTOProps, mapDispatchToProps)(HomePage);
