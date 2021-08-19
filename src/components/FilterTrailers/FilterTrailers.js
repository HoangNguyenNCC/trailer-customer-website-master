//Component for the Filter dropdown in the searchTrailers page

import React, { Component, Fragment } from "react";

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
import { filterTrailers } from "../../redux/actions/dataActions";

/* Props:
  filters : list of filters (Redux store -> data)
  filtercount : Count of selected filters (Redux store -> data)
*/
class FilterTrailers extends Component {
  constructor(props) {
    super(props);
    // filters set to those in the redux state -> data
    //filterCount : number of filters selected
    this.state = {
      filters: this.props.filters,
      count: this.props.filterCount,
    };
  }
  // async componentDidMount(){
  //   await this.setState({filters:this.props.filters})
  // }

  // function called when a filter is selected or unchecked
  //params : val:value of field, index:arr index of that option, type:filter category

  onCheck = async (val, index, type) => {
    const typeArr = this.state.filters;
    typeArr[type][index].selected = val;
    await this.setState((prevState) => ({
      filters: { ...typeArr },
      count: val ? this.props.filterCount + 1 : this.props.filterCount - 1,
    }));

    //redux action which updates filters and subsequently updates trailerList in the redux store -> data
    this.props.filterTrailers(this.state);
  };

  render() {
    const { filters } = this.state;
    return (
      <>
        <Button
          color="secondary"
          id="tooltip53831456"
          type="button"
          style={{
            width: "50%",
          }}
        >
          filter <i className="fa fa-filter"></i>
        </Button>
        <UncontrolledPopover
          placement="bottom"
          trigger="legacy"
          target="tooltip53831456"
          className="popover-secondary"
          style={{
            minWidth: "300px",
          }}
        >
          <PopoverHeader>Filter By:</PopoverHeader>
          <PopoverBody
            style={{
              //   minWidth: "300px !important",
              padding: "0",
              cursor: "pointer",
            }}
          >
            <ListGroup>
              {/* check so that dropdown doesn't attempt loading with null values for trailer/rental-item-type type based filters */}
              {filters && filters.trailerType && (
                <Fragment>
                  <ListGroupItem
                    className="text-primary font-weight-bold"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    id="filter-by-trailer-type-trigger"
                  >
                    <div>Trailer Type</div>
                    <i className="fa fa-chevron-right"></i>
                  </ListGroupItem>
                  <UncontrolledCollapse toggler="#filter-by-trailer-type-trigger">
                    <ListGroup>
                      {filters.trailerType.map((type, i) => (
                        <ListGroupItem
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                          key={"A" + i}
                        >
                          <div>{type.name}</div>
                          <input
                            type="checkbox"
                            checked={filters.trailerType[i].selected}
                            onChange={(e) =>
                              this.onCheck(e.target.checked, i, "trailerType")
                            }
                          />
                        </ListGroupItem>
                      ))}
                    </ListGroup>
                  </UncontrolledCollapse>
                </Fragment>
              )}
              {filters && filters.modelType && (
                <Fragment>
                  <ListGroupItem
                    className="text-primary font-weight-bold"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    id="filter-by-model-type-trigger"
                  >
                    <div>Trailer Model</div>
                    <i className="fa fa-chevron-right"></i>
                  </ListGroupItem>
                  <UncontrolledCollapse toggler="#filter-by-model-type-trigger">
                    <ListGroup>
                      {filters.modelType.map((type, i) => (
                        <ListGroupItem
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                          key={"B" + i}
                        >
                          <div>{type.name}</div>
                          <input
                            type="checkbox"
                            checked={filters.modelType[i].selected}
                            onChange={(e) =>
                              this.onCheck(e.target.checked, i, "modelType")
                            }
                          />
                        </ListGroupItem>
                      ))}
                    </ListGroup>
                  </UncontrolledCollapse>
                </Fragment>
              )}
              {/* check so that dropdown doesn't attempt loading with null values for delivery type based filters */}
              {/* {filters && filters.deliveryType && (
                <Fragment>
                  <ListGroupItem
                    className="text-primary font-weight-bold"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    id="filter-by-trailer-delivery-type-trigger"
                  >
                    <div>Trailer Delivery</div>
                    <i className="fa fa-chevron-right"></i>
                  </ListGroupItem>
                  <UncontrolledCollapse toggler="#filter-by-trailer-delivery-type-trigger">
                    <ListGroup>
                      {filters.deliveryType.map((type, i) => (
                        <ListGroupItem
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                          key={"C" + i}
                        >
                          <div>{type.name}</div>
                          <input
                            type="checkbox"
                            value={filters.deliveryType[i].selected}
                            onChange={(e) =>
                              this.onCheck(e.target.checked, i, "deliveryType")
                            }
                          />
                        </ListGroupItem>
                      ))}
                    </ListGroup>
                  </UncontrolledCollapse>
                </Fragment>
              )} */}
              {/* check so that dropdown doesn't attempt loading with null values for upsell type based filters */}
              {filters && filters.upsellType && (
                <Fragment>
                  <ListGroupItem
                    className="text-primary font-weight-bold"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    id="filter-by-upsell-items-trigger"
                  >
                    <div>Upsell Items</div>
                    <i className="fa fa-chevron-right"></i>
                  </ListGroupItem>
                  <UncontrolledCollapse toggler="#filter-by-upsell-items-trigger">
                    <ListGroup>
                      {filters.upsellType.map((type, i) => (
                        <ListGroupItem
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                          key={"D" + i}
                        >
                          <div>{type.name}</div>
                          <input
                            type="checkbox"
                            checked={type.selected}
                            onChange={(e) =>
                              this.onCheck(e.target.checked, i, "upsellType")
                            }
                          />
                        </ListGroupItem>
                      ))}
                    </ListGroup>
                  </UncontrolledCollapse>
                </Fragment>
              )}
            </ListGroup>
          </PopoverBody>
        </UncontrolledPopover>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  filters: state.data.filters,
  filterCount: state.data.filterCount,
});

const mapDispatchToProps = {
  filterTrailers,
};
export default connect(mapStateToProps, mapDispatchToProps)(FilterTrailers);
