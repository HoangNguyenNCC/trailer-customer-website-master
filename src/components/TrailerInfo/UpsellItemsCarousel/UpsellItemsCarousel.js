import React, { Component } from "react";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import CarouselCard from "./CarouselCard/CarouselCard";

/* Props:
  upsellItems : list of upsellItems
  */
class UpsellItemsCarousel extends Component {
  // A responsive carousel of upsell items which can be added to cart directly from the cards itself.
  render() {
    const { upsellItems } = this.props;
    const responsive = {
      superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 4000, min: 3000 },
        // items: 5,
        items: 1,
      },
      desktop: {
        breakpoint: { max: 3000, min: 1024 },
        // items: 3,
        items: 1,
      },
      tablet: {
        breakpoint: { max: 1024, min: 464 },
        // items: 2,
        items: 1,
      },
      mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
      },
    };
    return (
      <>
        <h5
          style={{
            textAlign: "center",
          }}
          className="  text-primary"
        >
          Upsell Items
        </h5>
        <Carousel responsive={responsive} className="mb-4">
          {upsellItems.map((item) => {
            return <CarouselCard key={item._id} upsellItem={item} />;
          })}
        </Carousel>
      </>
    );
  }
}

export default UpsellItemsCarousel;
