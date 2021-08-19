import React, { Component } from "react";
import {
  Button,
  PopoverHeader,
  PopoverBody,
  UncontrolledPopover,
  UncontrolledCollapse,
  ListGroupItem,
  ListGroup,
} from "reactstrap";
import { connect } from "react-redux";
import { sortTrailers } from "../../redux/actions/dataActions";

/* Props:
  sortTrailers() : Action which sorts trailers, PARAMETERS : property to sort on and order:ASC or DESC

  Action is called onClick for all types of sort options
*/

class SortTrailers extends Component {
  render() {
    return (
      <>
        <Button
          color="secondary"
          id="tooltip538314748"
          type="button"
          style={{
            width: "50%",
          }}
        >
          Sort <i className="fa fa-sort"></i>
        </Button>
        <UncontrolledPopover
          placement="bottom"
          trigger="legacy"
          target="tooltip538314748"
          className="popover-secondary"
          style={{
            minWidth: "300px",
          }}
        >
          <PopoverHeader>Sort By:</PopoverHeader>
          <PopoverBody
            style={{
              //   minWidth: "300px !important",
              padding: "0",
              cursor: "pointer",
            }}
          >
            <ListGroup>
              <ListGroupItem
                className="text-primary font-weight-bold"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                id="sort-by-price-trigger"
              >
                <div>Price</div>
                <i className="fa fa-chevron-right"></i>
              </ListGroupItem>
              <UncontrolledCollapse toggler="#sort-by-price-trigger">
                <ListGroup>
                  <ListGroupItem
                    onClick={() =>
                      this.props.sortTrailers({
                        property: "price",
                        order: "asc",
                      })
                    }
                  >
                    Low to High
                  </ListGroupItem>
                  <ListGroupItem
                    onClick={() =>
                      this.props.sortTrailers({
                        property: "price",
                        order: "desc",
                      })
                    }
                  >
                    High to Low
                  </ListGroupItem>
                </ListGroup>
              </UncontrolledCollapse>
              <ListGroupItem
                className="text-primary font-weight-bold"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                id="sort-by-distance-trigger"
              >
                <div>Distance</div>
                <i className="fa fa-chevron-right"></i>
              </ListGroupItem>
              <UncontrolledCollapse toggler="#sort-by-distance-trigger">
                <ListGroup>
                  <ListGroupItem
                    onClick={() =>
                      this.props.sortTrailers({
                        property: "licenseeDistance",
                        order: "asc",
                      })
                    }
                  >
                    Nearest First
                  </ListGroupItem>
                  <ListGroupItem
                    onClick={() =>
                      this.props.sortTrailers({
                        property: "licenseeDistance",
                        order: "desc",
                      })
                    }
                  >
                    Furthest First
                  </ListGroupItem>
                </ListGroup>
              </UncontrolledCollapse>
              <ListGroupItem
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                className="text-primary font-weight-bold"
                id="sort-by-rating-trigger"
              >
                <div>Rating</div>
                <i className="fa fa-chevron-right"></i>
              </ListGroupItem>
              <UncontrolledCollapse toggler="#sort-by-rating-trigger">
                <ListGroup>
                  <ListGroupItem>5 stars</ListGroupItem>
                  <ListGroupItem>4 stars and above</ListGroupItem>
                </ListGroup>
              </UncontrolledCollapse>
            </ListGroup>
          </PopoverBody>
        </UncontrolledPopover>
      </>
    );
  }
}

const mapDispatchToProps = {
  sortTrailers,
};
export default connect(null, mapDispatchToProps)(SortTrailers);
