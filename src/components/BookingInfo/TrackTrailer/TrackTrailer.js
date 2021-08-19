import React, { Component } from "react";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";

import { withGoogleMap, GoogleMap, Marker, Polyline } from "react-google-maps";
import io from "socket.io-client";

import Axios from "axios";
const ENDPOINT = "https://t2ybeta.herokuapp.com/";

/* Props:
  coord : Object of coordinates for booking,
  rentalId
*/
export default class TrackTrailer extends Component {
  constructor(props) {
    super(props);
    this.socket = null;
  }
  async componentDidUpdate(prevProps, prevState) {
    if (this.state.isOpen && !prevState.isOpen) {
      this.socket = io(ENDPOINT);
      const reqObj = {
        rentalId: this.props.rentalId,
        type: "dropoff",
        action: "start",
      };

      Axios.post("/user/rental/location/track", reqObj).then((res) =>
        this.setState({
          coord: res.data.locationObj.dropOffLocation.location.coordinates,
        })
      );
      this.socket.on("connect", (connectedSocket) => {
        console.log("Socket connected!", this.socket.connected);
        let reqObj = {
          invoiceNumber: this.props.rentalId,
        };
        console.log(reqObj);
        this.socket.emit("userJoin", reqObj);

        console.log("EMITTED");
        this.socket.on("trackingData", (data) => {
          console.log("Coordinates fetched", data);
        });
        // this.fetchCoordinates();
      });
    }
  }

  fetchCoordinates = () => {
    this.socket.on("trackingData", (data) => {
      console.log("Coordinates fetched", data);
    });
  };
  state = {
    isOpen: false,
  };

  toggleModal = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    const { coord } = this.props;
    const coord2 = [coord[0] - 0.0002, coord[1] - 0.0002];
    const path = [];
    path.push(
      { lat: coord[0], lng: coord[1] },
      { lat: coord2[0], lng: coord2[1] }
    );
    //withGoogleMap is an HOC from the react-google-maps library,
    //defaultCenter is where the map should be centered {lat:latitude, lng:longitude value}
    //defaultZoom: Scale of zoom
    // const GoogleMapExample = withGoogleMap((props) => (
    //   <GoogleMap
    //     defaultCenter={{ lat: coord[0], lng: coord[1] }}
    //     defaultZoom={13}
    //   >
    //     {/* Set marker on the map to show position of trailer -- position = {lat:latitude, lng:longitude value} */}
    //     <Marker position={{ lat: coord[0], lng: coord[1] }} />
    //   </GoogleMap>
    // ));

    const GoogleMapExample = withGoogleMap((props) => (
      <GoogleMap
        defaultCenter={{ lat: coord[0], lng: coord[1] }}
        defaultZoom={13}
      >
        <Polyline
          path={path}
          options={{
            geodesic: true,
            strokeColor: "#111111",
            strokeOpacity: 1.0,
            strokeWeight: 2,
          }}
        />
        <Marker position={{ lat: coord[0], lng: coord[1] }} />
      </GoogleMap>
    ));

    const { isOpen } = this.state;
    return (
      <div>
        <Button
          // outline
          block
          className="py-2"
          color="success"
          disabled={this.props.disabled}
          onClick={this.toggleModal}
        >
          {this.props.text}
        </Button>
        <Modal isOpen={isOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>
            Live Trailer Tracking
          </ModalHeader>
          <ModalBody>
            {/* This wrapper makes the Map component responsive */}
            <div
              style={{
                height: 350,
                width: "100%",
                display: "flex",
                flexFlow: "row nowrap",
                justifyContent: "center",
                padding: 0,
              }}
            >
              {/* Map element generated using the withGoogleMap HOC earlier */}
              <GoogleMapExample
                containerElement={
                  <div
                    style={{
                      width: "100%",
                      marginLeft: 0,
                    }}
                  />
                }
                mapElement={<div className="h-100" />}
              />
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}
