//Card component to display each Featured Trailer as an individual Card on the Home page

import React from "react";
import { Card, CardBody, CardImg, Col, Button } from "reactstrap";

/* Props:
  trailer :object containing top-level details of a featured trailer
*/

const FeaturedTrailerCard = ({ trailer, handleFeature }) => {
  return (
    <Col
      lg="4"
      md="6"
      style={{
        marginBottom: "50px",
      }}
      onClick={() => handleFeature(trailer.name)}
    >
      <Card
        className="card-lift--hover shadow border-0"
        style={{
          height: "100%",
        }}
      >
        <CardBody className="py-5">
          <CardImg top width="100%" src={trailer.photos[0].data} />
          <h6 className="text-primary text-uppercase">{trailer.name}</h6>
          <p className="description pb-3">
            {trailer.description.substring(0, 200) + "..."}
            {/* Prevent paragrapph long descriptions from being rendered in cards */}
          </p>

          <Button block color="info">
            Search
          </Button>
        </CardBody>
      </Card>
    </Col>
  );
};

export default FeaturedTrailerCard;
