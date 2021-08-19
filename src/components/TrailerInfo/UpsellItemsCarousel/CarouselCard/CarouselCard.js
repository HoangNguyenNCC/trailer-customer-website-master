import React, { Component } from "react";

import { Row, Card, CardBody, CardImg, Button } from "reactstrap";
import { connect } from "react-redux";
import { updateUpsellItem } from "../../../../redux/actions/dataActions";

/* Props:
  upsellItem : object containing specific upsellItem details
  updateUpsellItem() : redux action to update upsell quantity in store cart
  */
class CarouselCard extends Component {
  //Cards in the Upsell Item Carousel to add / delete an upsell item to/from the cart

  state = {
    quantity: 0,
  };
  handleChange = (e) => {
    this.props.updateUpsellItem(this.props.upsellItem._id, e.target.value); //Add / remove items from cart using the id and value required
    this.setState({ quantity: e.target.value });
  };
  render() {
    const { upsellItem } = this.props;
    return (
      <Card
        style={{
          height: "100%",
        }}
      >
        <CardBody>
          <CardImg
            src={upsellItem.photo ? upsellItem.photo[0] : ""}
            alt="Upsell Item"
          />
          <div>
            <h4 className="display-4 text-primary">{upsellItem.name}</h4>
            <p>{upsellItem.description}</p>
            <Row
              style={{
                justifyContent: "center",
              }}
              className="px-2"
            >
              <input
                type="number"
                id="quantity"
                name="quantity"
                placeholder="quantity"
                className="mx-2 mb-2"
                value={this.state.quantity}
                onChange={this.handleChange}
                min="0"
                max={upsellItem.availableQuantity}
                style={{
                  flex: "1",
                }}
              />
              <Button color="primary" className="ml-1 mb-2">
                Add
              </Button>
            </Row>
          </div>
        </CardBody>
      </Card>
    );
  }
}
const mapDispatchToProps = {
  updateUpsellItem,
};
export default connect(null, mapDispatchToProps)(CarouselCard);
