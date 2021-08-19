import React, { Component, Fragment } from "react";
import {
  Container,
  InputGroup,
  InputGroupAddon,
  Input,
  InputGroupText,
  Row,
  Col,
  Card,
  CardBody,
  CardImg,
  Button,
  Spinner,
} from "reactstrap";
import { Link } from "react-router-dom";
import ErrorShow from "components/Validation/ErrorShow/ErrorShow";

import "./SearchTrailers.css";
import ReactDatetime from "react-datetime";
/* global google*/

// Google Global variable set 👆
import FilterTrailers from "../FilterTrailers/FilterTrailers"; //Component for filters
import SortTrailers from "../SortTrailers/SortTrailers"; //Component for sorting options
import moment from "moment";
import { connect } from "react-redux";
import { searchTrailers } from "../../redux/actions/dataActions";
import { toast } from "react-toastify";

/* Props:
  history : react - router
  Redux :
    trailers : list of updatedTrailers
    filters : list of filter options
    loading : state of UI loading

      searchTrailers() : To initiate search -- Params : Request object for search, history object from router, and page from where search was called
*/
class SearchTrailers extends Component {
  state = {
    location: "",
    fromDate: "",
    toDate: "",
    toTime: "",
    fromTime: "",
  };
  async componentDidMount() {
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("autocomplete"),
      {}
    );
    this.autocomplete.addListener("place_changed", this.handlePlaceSelect);
    if (this.props.featured.length > 0) {
      toast.info(
        `🙌 Results filtered for ${this.props.featured}. Change filters to view all.`,
        {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    }
  }

  handleDateChange = (date, name) => {
    const d = moment(date).format("DD MMM,YYYY");
    const t = moment(date).format("kk:mm");

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
    const {
      fromUTC,
      toUTC,
      location,
      address,
      addressError,
      dateError,
    } = this.state;

    //Check if any fields are empty, if yes, abort
    if (!fromUTC || !toUTC || !address) {
      this.setState({ dateError: "Fields cannot be empty" });
      return false;
    }
    //If there is some error with the date or address, abort
    if (addressError || dateError) {
      return false;
    }
    //If date is not a valid range, abort
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
    this.setState({ dateError: "" }, () => {
      console.log("dates correct");
    });
    this.props.searchTrailers(
      reqObj,
      this.props.history,
      "search",
      this.props.featured
    ); //Search Trailers using the reqObj from input fields.
    //3rd parameter specifies from which page is this request coming from;
  };

  handlePlaceSelect = () => {
    const mapsObj = this.autocomplete.getPlace(); //Fetch entire address details obj given the selected input
    console.log(mapsObj);
    const len = mapsObj.address_components.length;
    // if the address doesn't have a pincode, ask for more precision, else, store it in desired form
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

  render() {
    const { loading, trailers } = this.props;
    const { fromDate, fromTime, toDate, toTime } = this.state;
    return (
      <main>
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
            <Row>
              <Col xs={12} lg={4}>
                <InputGroup className="input-group mb-4">
                  <Input
                    placeholder="Find a Trailer"
                    type="text"
                    id="autocomplete"
                    ref="input"
                    required
                  />
                  <InputGroupAddon addonType="append">
                    <InputGroupText>
                      <i className="ni ni-zoom-split-in" />
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <ErrorShow>{this.state.addressError}</ErrorShow>
              </Col>
              <Col xs={12} lg={3} md={6}>
                <InputGroup className="input-group mb-4 search-trailer-data-input">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-calendar-grid-58" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <ReactDatetime
                    inputProps={{
                      placeholder: "From Date",
                      required: true,
                      value: fromDate ? fromDate + " " + fromTime : "",
                    }}
                    //dates before current are not valid ffor search
                    isValidDate={(currentDate) => {
                      return currentDate.isAfter(ReactDatetime.moment());
                    }}
                    onChange={(moment) =>
                      this.handleDateChange(moment, "fromDate")
                    }
                    timeConstraints={{
                      hours: {
                        min: 9,
                        max: 20,
                      },
                      minutes: {
                        // time steps : 00 - 15 - 30 - 45 - 00
                        step: 15,
                      },
                    }}
                  />
                </InputGroup>
              </Col>
              <Col xs={12} lg={3} md={6}>
                <InputGroup className="input-group mb-4 search-trailer-data-input">
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
              </Col>
              <Col xs={12} lg={2}>
                <Button
                  block
                  color="warning"
                  className="mb-4"
                  onClick={this.handleSubmit}
                >
                  Search
                </Button>
              </Col>
            </Row>
            <ErrorShow>{this.state.dateError}</ErrorShow>
          </Container>
        </section>
        <section>
          <Container>
            {loading ? (
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
              <Fragment>
                <Row
                  style={{
                    justifyContent: "space-around",
                  }}
                  className="my-4"
                >
                  <Col
                    md={6}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    {/* Sorting Dropdown */}
                    <SortTrailers />
                  </Col>
                  <Col
                    md={6}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    {/* Filter Dropdown */}
                    <FilterTrailers />
                  </Col>
                </Row>
                <Row className="mt-5" style={{ minHeight: "75vh" }}>
                  {/* Once trailers have been fetched for search, map them in a GRID of Cards */}
                  {trailers.length > 0
                    ? trailers.map((trailer, i) => {
                        return (
                          <Col key={i} lg={4} md={6} className="mb-5">
                            <Card
                              className="card-lift--hover shadow border-0"
                              style={
                                {
                                  // height: "100%",
                                }
                              }
                            >
                              <Link to={`/trailer/${trailer.rentalItemId}`}>
                                <CardBody className="py-4">
                                  <CardImg
                                    top
                                    width="100%"
                                    src={
                                      trailer.photo[0]
                                        ? trailer.photo[0].data
                                        : ""
                                    }
                                  ></CardImg>
                                  <Row className="mt-4">
                                    <Col>
                                      <h6 className="font-weight-bold text-primary">
                                        {trailer.name}
                                      </h6>
                                      <p className="mt-2">
                                        {trailer.licenseeName}
                                      </p>
                                    </Col>
                                    <Col
                                      style={{
                                        textAlign: "right",
                                      }}
                                    >
                                      <span className="btn-primary p-2 rounded">
                                        {trailer.price}
                                      </span>
                                      <p className="mt-3">
                                        {trailer.licenseeDistance}
                                      </p>
                                    </Col>
                                  </Row>
                                  <div className="text-muted font-weight-light text-center">
                                    {trailer.upsellItems.length} upsell items
                                    available
                                  </div>
                                </CardBody>
                              </Link>
                            </Card>
                          </Col>
                        );
                      })
                    : "No trailers to display. Please search again"}
                  {/* Show text as nothing to display in case of 0 trailers returned */}
                </Row>
              </Fragment>
            )}
          </Container>
        </section>
      </main>
    );
  }
}

const mapStateToProps = (state) => ({
  trailers: state.data.updatedTrailers, //List of filtered trailers
  loading: state.UI.loading,
  filters: state.data.filters,
  featured: state.data.featured,
});

const mapDispatchToProps = {
  searchTrailers,
};
export default connect(mapStateToProps, mapDispatchToProps)(SearchTrailers);
